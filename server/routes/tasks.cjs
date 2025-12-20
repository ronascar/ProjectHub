const express = require('express');
const { authMiddleware } = require('../middleware/auth.cjs');

const router = express.Router();

// GET /api/tasks - List tasks (with filters)
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { projectId, assigneeId, status, priority, search } = req.query;

        const where = {};

        if (projectId) where.projectId = projectId;
        if (assigneeId) where.assigneeId = assigneeId;
        if (status) where.status = status;
        if (priority) where.priority = priority;

        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }

        const tasks = await req.prisma.task.findMany({
            where,
            include: {
                project: { select: { id: true, name: true, color: true } },
                assignee: { select: { id: true, name: true, avatar: true } },
                creator: { select: { id: true, name: true } },
                tags: {
                    include: { tag: true }
                },
                _count: {
                    select: { subtasks: true, comments: true, attachments: true }
                }
            },
            orderBy: [
                { status: 'asc' },
                { priority: 'desc' },
                { order: 'asc' }
            ]
        });

        res.json(tasks);
    } catch (error) {
        console.error('List tasks error:', error);
        res.status(500).json({ error: 'Failed to list tasks' });
    }
});

// GET /api/tasks/my - Get tasks assigned to current user
router.get('/my', authMiddleware, async (req, res) => {
    try {
        const tasks = await req.prisma.task.findMany({
            where: { assigneeId: req.user.id },
            include: {
                project: { select: { id: true, name: true, color: true } },
                tags: { include: { tag: true } }
            },
            orderBy: [
                { status: 'asc' },
                { dueDate: 'asc' }
            ]
        });

        res.json(tasks);
    } catch (error) {
        console.error('Get my tasks error:', error);
        res.status(500).json({ error: 'Failed to get tasks' });
    }
});

// GET /api/tasks/kanban/:projectId - Get tasks grouped by status for Kanban
router.get('/kanban/:projectId', authMiddleware, async (req, res) => {
    try {
        const { projectId } = req.params;

        const tasks = await req.prisma.task.findMany({
            where: { projectId, parentId: null },
            include: {
                assignee: { select: { id: true, name: true, avatar: true } },
                tags: { include: { tag: true } },
                _count: {
                    select: { subtasks: true, comments: true }
                }
            },
            orderBy: { order: 'asc' }
        });

        // Group by status
        const kanban = {
            TODO: tasks.filter(t => t.status === 'TODO'),
            IN_PROGRESS: tasks.filter(t => t.status === 'IN_PROGRESS'),
            REVIEW: tasks.filter(t => t.status === 'REVIEW'),
            DONE: tasks.filter(t => t.status === 'DONE'),
            BLOCKED: tasks.filter(t => t.status === 'BLOCKED')
        };

        res.json(kanban);
    } catch (error) {
        console.error('Get kanban error:', error);
        res.status(500).json({ error: 'Failed to get kanban data' });
    }
});

// GET /api/tasks/:id - Get task by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const task = await req.prisma.task.findUnique({
            where: { id: req.params.id },
            include: {
                project: { select: { id: true, name: true, color: true } },
                assignee: { select: { id: true, name: true, avatar: true, email: true } },
                creator: { select: { id: true, name: true } },
                parent: { select: { id: true, title: true } },
                subtasks: {
                    include: {
                        assignee: { select: { id: true, name: true, avatar: true } }
                    },
                    orderBy: { order: 'asc' }
                },
                tags: { include: { tag: true } },
                comments: {
                    include: {
                        user: { select: { id: true, name: true, avatar: true } }
                    },
                    orderBy: { createdAt: 'desc' }
                },
                attachments: true
            }
        });

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        res.json(task);
    } catch (error) {
        console.error('Get task error:', error);
        res.status(500).json({ error: 'Failed to get task' });
    }
});

// POST /api/tasks - Create task
router.post('/', authMiddleware, async (req, res) => {
    try {
        const {
            title, description, projectId, assigneeId, status, priority,
            dueDate, estimatedHours, parentId, tags
        } = req.body;

        if (!title || !projectId) {
            return res.status(400).json({ error: 'Title and projectId are required' });
        }

        // Get max order for the status
        const lastTask = await req.prisma.task.findFirst({
            where: { projectId, status: status || 'TODO' },
            orderBy: { order: 'desc' }
        });

        const task = await req.prisma.task.create({
            data: {
                title,
                description,
                projectId,
                assigneeId,
                creatorId: req.user.id,
                status: status || 'TODO',
                priority: priority || 'MEDIUM',
                dueDate: dueDate ? new Date(dueDate) : null,
                estimatedHours,
                parentId,
                order: (lastTask?.order || 0) + 1,
                tags: tags?.length ? {
                    create: tags.map(tagId => ({
                        tag: { connect: { id: tagId } }
                    }))
                } : undefined
            },
            include: {
                project: { select: { id: true, name: true } },
                assignee: { select: { id: true, name: true, avatar: true } },
                tags: { include: { tag: true } }
            }
        });

        // Log activity
        await req.prisma.activity.create({
            data: {
                type: 'TASK_CREATED',
                description: `Tarefa "${title}" foi criada`,
                userId: req.user.id,
                projectId
            }
        });

        // Create notification for assignee
        if (assigneeId && assigneeId !== req.user.id) {
            await req.prisma.notification.create({
                data: {
                    type: 'TASK_ASSIGNED',
                    title: 'Nova tarefa atribuída',
                    message: `Você foi atribuído à tarefa "${title}"`,
                    userId: assigneeId,
                    link: `/tasks/${task.id}`
                }
            });
        }

        res.status(201).json(task);
    } catch (error) {
        console.error('Create task error:', error);
        res.status(500).json({ error: 'Failed to create task' });
    }
});

// PUT /api/tasks/:id - Update task
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            title, description, status, priority, assigneeId,
            dueDate, estimatedHours, actualHours, order
        } = req.body;

        const updateData = {
            title, description, status, priority, assigneeId,
            estimatedHours, actualHours, order
        };

        if (dueDate !== undefined) {
            updateData.dueDate = dueDate ? new Date(dueDate) : null;
        }

        // Handle completion
        if (status === 'DONE') {
            updateData.completedAt = new Date();
        } else if (status && status !== 'DONE') {
            updateData.completedAt = null;
        }

        // Remove undefined values
        Object.keys(updateData).forEach(key =>
            updateData[key] === undefined && delete updateData[key]
        );

        const task = await req.prisma.task.update({
            where: { id },
            data: updateData,
            include: {
                project: { select: { id: true, name: true } },
                assignee: { select: { id: true, name: true, avatar: true } },
                tags: { include: { tag: true } }
            }
        });

        // Log activity if status changed
        if (status) {
            await req.prisma.activity.create({
                data: {
                    type: status === 'DONE' ? 'TASK_COMPLETED' : 'TASK_UPDATED',
                    description: `Tarefa "${task.title}" foi ${status === 'DONE' ? 'concluída' : 'atualizada'}`,
                    userId: req.user.id,
                    projectId: task.projectId
                }
            });
        }

        res.json(task);
    } catch (error) {
        console.error('Update task error:', error);
        res.status(500).json({ error: 'Failed to update task' });
    }
});

// PUT /api/tasks/:id/reorder - Reorder task (for drag and drop)
router.put('/:id/reorder', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { status, order } = req.body;

        const task = await req.prisma.task.update({
            where: { id },
            data: { status, order }
        });

        res.json(task);
    } catch (error) {
        console.error('Reorder task error:', error);
        res.status(500).json({ error: 'Failed to reorder task' });
    }
});

// DELETE /api/tasks/:id - Delete task
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        await req.prisma.task.delete({
            where: { id }
        });

        res.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Delete task error:', error);
        res.status(500).json({ error: 'Failed to delete task' });
    }
});

// ==================== COMMENTS ====================

// POST /api/tasks/:id/comments - Add comment to task
router.post('/:id/comments', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { content, parentId } = req.body;

        if (!content) {
            return res.status(400).json({ error: 'Content is required' });
        }

        const comment = await req.prisma.comment.create({
            data: {
                content,
                taskId: id,
                userId: req.user.id,
                parentId
            },
            include: {
                user: { select: { id: true, name: true, avatar: true } }
            }
        });

        res.status(201).json(comment);
    } catch (error) {
        console.error('Add comment error:', error);
        res.status(500).json({ error: 'Failed to add comment' });
    }
});

module.exports = router;
