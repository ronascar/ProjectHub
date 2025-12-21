const express = require('express');
const { authMiddleware, managerMiddleware } = require('../middleware/auth.cjs');

const router = express.Router();

// GET /api/projects - List all projects
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { search, status, priority, clientId, ownerId } = req.query;

        const where = { isArchived: false };

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (status) where.status = status;
        if (priority) where.priority = priority;
        if (clientId) where.clientId = clientId;
        if (ownerId) where.ownerId = ownerId;

        const projects = await req.prisma.project.findMany({
            where,
            select: {
                id: true,
                name: true,
                shortDescription: true,
                category: true,
                status: true,
                priority: true,
                progress: true,
                startDate: true,
                dueDate: true,
                color: true,
                createdAt: true,
                owner: {
                    select: { id: true, name: true, avatar: true }
                },
                client: {
                    select: { id: true, name: true, company: true }
                },
                members: {
                    select: {
                        user: { select: { id: true, name: true, avatar: true } },
                        role: true
                    },
                    take: 5
                },
                _count: {
                    select: { tasks: true, members: true }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        res.json(projects);
    } catch (error) {
        console.error('List projects error:', error);
        res.status(500).json({ error: 'Failed to list projects' });
    }
});

// GET /api/projects/:id - Get project by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const project = await req.prisma.project.findUnique({
            where: { id: req.params.id },
            include: {
                owner: {
                    select: { id: true, name: true, avatar: true, email: true }
                },
                client: true,
                members: {
                    include: {
                        user: { select: { id: true, name: true, avatar: true, email: true, department: true } }
                    }
                },
                technologies: {
                    include: {
                        technology: true
                    }
                },
                deliverables: {
                    orderBy: { order: 'asc' }
                },
                resources: true,
                versions: {
                    orderBy: { createdAt: 'desc' }
                },
                tasks: {
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        priority: true,
                        assignee: { select: { id: true, name: true, avatar: true } }
                    },
                    orderBy: { createdAt: 'desc' },
                    take: 20
                },
                _count: {
                    select: { tasks: true, comments: true }
                }
            }
        });

        if (!project) {
            return res.status(404).json({ error: 'Project not found' });
        }

        // Calculate task stats
        const taskStats = await req.prisma.task.groupBy({
            by: ['status'],
            where: { projectId: req.params.id },
            _count: true
        });

        res.json({ ...project, taskStats });
    } catch (error) {
        console.error('Get project error:', error);
        res.status(500).json({ error: 'Failed to get project' });
    }
});

// POST /api/projects - Create project
router.post('/', authMiddleware, managerMiddleware, async (req, res) => {
    try {
        const {
            name, description, shortDescription, category, status, priority,
            startDate, estimatedDate, dueDate, clientId, color, budget,
            technologies, members
        } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Project name is required' });
        }

        const project = await req.prisma.project.create({
            data: {
                name,
                description,
                shortDescription,
                category,
                status: status || 'PLANNING',
                priority: priority || 'MEDIUM',
                startDate: startDate ? new Date(startDate) : null,
                estimatedDate: estimatedDate ? new Date(estimatedDate) : null,
                dueDate: dueDate ? new Date(dueDate) : null,
                clientId,
                color,
                budget,
                ownerId: req.user.id,
                // Add technologies
                technologies: technologies?.length ? {
                    create: technologies.map(techId => ({
                        technology: { connect: { id: techId } }
                    }))
                } : undefined,
                // Add members
                members: members?.length ? {
                    create: members.map(m => ({
                        user: { connect: { id: m.userId } },
                        role: m.role || 'DEVELOPER'
                    }))
                } : undefined
            },
            include: {
                owner: { select: { id: true, name: true, avatar: true } },
                client: { select: { id: true, name: true } },
                technologies: { include: { technology: true } },
                members: { include: { user: { select: { id: true, name: true, avatar: true } } } }
            }
        });

        // Log activity
        await req.prisma.activity.create({
            data: {
                type: 'PROJECT_CREATED',
                description: `Projeto "${name}" foi criado`,
                userId: req.user.id,
                projectId: project.id
            }
        });

        res.status(201).json(project);
    } catch (error) {
        console.error('Create project error:', error);
        res.status(500).json({ error: 'Failed to create project' });
    }
});

// PATCH /api/projects/:id/quick-update - Quick update (status, client, progress)
router.patch('/:id/quick-update', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, clientId, progress } = req.body;

        // Check if user can update (owner, admin, or manager)
        const existing = await req.prisma.project.findUnique({
            where: { id },
            select: { ownerId: true, name: true }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Project not found' });
        }

        if (existing.ownerId !== req.user.id && !['ADMIN', 'MANAGER'].includes(req.user.role)) {
            return res.status(403).json({ error: 'Not authorized to update this project' });
        }

        const updateData = {};
        
        if (status !== undefined) {
            updateData.status = status;
            if (status === 'COMPLETED') {
                updateData.completedAt = new Date();
                updateData.progress = 100;
            }
        }
        
        if (clientId !== undefined) {
            updateData.clientId = clientId === '' ? null : clientId;
        }
        
        if (progress !== undefined) {
            updateData.progress = Math.min(100, Math.max(0, parseInt(progress)));
        }

        const project = await req.prisma.project.update({
            where: { id },
            data: updateData,
            include: {
                owner: { select: { id: true, name: true, avatar: true } },
                client: { select: { id: true, name: true } },
                members: {
                    select: {
                        user: { select: { id: true, name: true, avatar: true } },
                        role: true
                    },
                    take: 5
                }
            }
        });

        res.json(project);
    } catch (error) {
        console.error('Quick update project error:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

// PUT /api/projects/:id - Update project
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name, description, shortDescription, category, status, priority, progress,
            startDate, estimatedDate, dueDate, clientId, color, budget, isArchived
        } = req.body;

        // Check if user can update (owner or admin)
        const existing = await req.prisma.project.findUnique({
            where: { id },
            select: { ownerId: true }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Project not found' });
        }

        if (existing.ownerId !== req.user.id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Not authorized to update this project' });
        }

        const updateData = {
            name, description, shortDescription, category, status, priority, progress,
            startDate: startDate ? new Date(startDate) : undefined,
            estimatedDate: estimatedDate ? new Date(estimatedDate) : undefined,
            dueDate: dueDate ? new Date(dueDate) : undefined,
            clientId, color, budget, isArchived
        };

        // Handle completion
        if (status === 'COMPLETED' && !updateData.completedAt) {
            updateData.completedAt = new Date();
            updateData.progress = 100;
        }

        // Remove undefined values
        Object.keys(updateData).forEach(key =>
            updateData[key] === undefined && delete updateData[key]
        );

        const project = await req.prisma.project.update({
            where: { id },
            data: updateData,
            include: {
                owner: { select: { id: true, name: true, avatar: true } },
                client: { select: { id: true, name: true } }
            }
        });

        // Log activity
        await req.prisma.activity.create({
            data: {
                type: 'PROJECT_UPDATED',
                description: `Projeto "${project.name}" foi atualizado`,
                userId: req.user.id,
                projectId: project.id
            }
        });

        res.json(project);
    } catch (error) {
        console.error('Update project error:', error);
        res.status(500).json({ error: 'Failed to update project' });
    }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', authMiddleware, managerMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // Soft delete by archiving
        await req.prisma.project.update({
            where: { id },
            data: { isArchived: true }
        });

        res.json({ message: 'Project archived successfully' });
    } catch (error) {
        console.error('Delete project error:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

// ==================== PROJECT MEMBERS ====================

// POST /api/projects/:id/members - Add member to project
router.post('/:id/members', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { userId, role } = req.body;

        const member = await req.prisma.projectMember.create({
            data: {
                projectId: id,
                userId,
                role: role || 'DEVELOPER'
            },
            include: {
                user: { select: { id: true, name: true, avatar: true, email: true } }
            }
        });

        res.status(201).json(member);
    } catch (error) {
        console.error('Add member error:', error);
        res.status(500).json({ error: 'Failed to add member' });
    }
});

// DELETE /api/projects/:id/members/:userId - Remove member from project
router.delete('/:id/members/:userId', authMiddleware, async (req, res) => {
    try {
        const { id, userId } = req.params;

        await req.prisma.projectMember.delete({
            where: {
                projectId_userId: { projectId: id, userId }
            }
        });

        res.json({ message: 'Member removed successfully' });
    } catch (error) {
        console.error('Remove member error:', error);
        res.status(500).json({ error: 'Failed to remove member' });
    }
});

// ==================== DELIVERABLES ====================

// POST /api/projects/:id/deliverables - Add deliverable
router.post('/:id/deliverables', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, status, dueDate } = req.body;

        // Get max order
        const lastDeliverable = await req.prisma.deliverable.findFirst({
            where: { projectId: id },
            orderBy: { order: 'desc' }
        });

        const deliverable = await req.prisma.deliverable.create({
            data: {
                projectId: id,
                title,
                description,
                status: status || 'PENDING',
                dueDate: dueDate ? new Date(dueDate) : null,
                order: (lastDeliverable?.order || 0) + 1
            }
        });

        res.status(201).json(deliverable);
    } catch (error) {
        console.error('Add deliverable error:', error);
        res.status(500).json({ error: 'Failed to add deliverable' });
    }
});

// PUT /api/projects/:id/deliverables/:deliverableId - Update deliverable
router.put('/:id/deliverables/:deliverableId', authMiddleware, async (req, res) => {
    try {
        const { deliverableId } = req.params;
        const { title, description, status, dueDate, order } = req.body;

        const updateData = { title, description, status, order };
        if (dueDate !== undefined) updateData.dueDate = dueDate ? new Date(dueDate) : null;
        if (status === 'COMPLETED') updateData.completedAt = new Date();

        Object.keys(updateData).forEach(key =>
            updateData[key] === undefined && delete updateData[key]
        );

        const deliverable = await req.prisma.deliverable.update({
            where: { id: deliverableId },
            data: updateData
        });

        res.json(deliverable);
    } catch (error) {
        console.error('Update deliverable error:', error);
        res.status(500).json({ error: 'Failed to update deliverable' });
    }
});

// DELETE /api/projects/:id/deliverables/:deliverableId - Delete deliverable
router.delete('/:id/deliverables/:deliverableId', authMiddleware, async (req, res) => {
    try {
        const { deliverableId } = req.params;

        await req.prisma.deliverable.delete({
            where: { id: deliverableId }
        });

        res.json({ message: 'Deliverable deleted successfully' });
    } catch (error) {
        console.error('Delete deliverable error:', error);
        res.status(500).json({ error: 'Failed to delete deliverable' });
    }
});

// ==================== RESOURCES ====================

// POST /api/projects/:id/resources - Add resource
router.post('/:id/resources', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, type, url, description, icon } = req.body;

        const resource = await req.prisma.resource.create({
            data: {
                projectId: id,
                name,
                type: type || 'LINK',
                url,
                description,
                icon
            }
        });

        res.status(201).json(resource);
    } catch (error) {
        console.error('Add resource error:', error);
        res.status(500).json({ error: 'Failed to add resource' });
    }
});

// DELETE /api/projects/:id/resources/:resourceId - Delete resource
router.delete('/:id/resources/:resourceId', authMiddleware, async (req, res) => {
    try {
        const { resourceId } = req.params;

        await req.prisma.resource.delete({
            where: { id: resourceId }
        });

        res.json({ message: 'Resource deleted successfully' });
    } catch (error) {
        console.error('Delete resource error:', error);
        res.status(500).json({ error: 'Failed to delete resource' });
    }
});

module.exports = router;
