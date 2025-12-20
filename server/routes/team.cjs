const express = require('express');
const { authMiddleware } = require('../middleware/auth.cjs');

const router = express.Router();

// GET /api/team - Get all team members with their project assignments
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { department, role, search } = req.query;

        const where = { isActive: true };

        if (department) where.department = { contains: department, mode: 'insensitive' };
        if (role) where.role = role;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }

        const members = await req.prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
                department: true,
                phone: true,
                createdAt: true,
                projectMembers: {
                    where: {
                        project: { isArchived: false }
                    },
                    select: {
                        role: true,
                        project: {
                            select: {
                                id: true,
                                name: true,
                                status: true,
                                color: true
                            }
                        }
                    }
                },
                assignedTasks: {
                    where: { status: { not: 'DONE' } },
                    select: { id: true }
                },
                _count: {
                    select: {
                        assignedTasks: true,
                        ownedProjects: true
                    }
                }
            },
            orderBy: { name: 'asc' }
        });

        // Calculate workload for each member
        const membersWithWorkload = members.map(member => ({
            ...member,
            activeProjects: member.projectMembers.length,
            pendingTasks: member.assignedTasks.length,
            workload: Math.min(100, member.assignedTasks.length * 10) // Simple workload calculation
        }));

        res.json(membersWithWorkload);
    } catch (error) {
        console.error('List team error:', error);
        res.status(500).json({ error: 'Failed to list team members' });
    }
});

// GET /api/team/:id - Get team member details
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const member = await req.prisma.user.findUnique({
            where: { id: req.params.id },
            select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                role: true,
                department: true,
                phone: true,
                createdAt: true,
                lastLogin: true,
                projectMembers: {
                    where: {
                        project: { isArchived: false }
                    },
                    include: {
                        project: {
                            select: {
                                id: true,
                                name: true,
                                status: true,
                                progress: true,
                                color: true,
                                dueDate: true
                            }
                        }
                    }
                },
                assignedTasks: {
                    where: { status: { not: 'DONE' } },
                    include: {
                        project: { select: { id: true, name: true } }
                    },
                    orderBy: { dueDate: 'asc' },
                    take: 10
                },
                _count: {
                    select: {
                        assignedTasks: true,
                        createdTasks: true,
                        ownedProjects: true,
                        comments: true
                    }
                }
            }
        });

        if (!member) {
            return res.status(404).json({ error: 'Team member not found' });
        }

        // Get task completion stats
        const taskStats = await req.prisma.task.groupBy({
            by: ['status'],
            where: { assigneeId: req.params.id },
            _count: true
        });

        res.json({ ...member, taskStats });
    } catch (error) {
        console.error('Get team member error:', error);
        res.status(500).json({ error: 'Failed to get team member' });
    }
});

// GET /api/team/stats/overview - Get team statistics overview
router.get('/stats/overview', authMiddleware, async (req, res) => {
    try {
        const [
            totalMembers,
            activeProjects,
            completedTasks,
            pendingTasks
        ] = await Promise.all([
            req.prisma.user.count({ where: { isActive: true } }),
            req.prisma.project.count({ where: { status: 'IN_PROGRESS', isArchived: false } }),
            req.prisma.task.count({ where: { status: 'DONE' } }),
            req.prisma.task.count({ where: { status: { not: 'DONE' } } })
        ]);

        // Get members by department
        const byDepartment = await req.prisma.user.groupBy({
            by: ['department'],
            where: { isActive: true },
            _count: true
        });

        // Get members by role
        const byRole = await req.prisma.user.groupBy({
            by: ['role'],
            where: { isActive: true },
            _count: true
        });

        res.json({
            totalMembers,
            activeProjects,
            completedTasks,
            pendingTasks,
            byDepartment,
            byRole
        });
    } catch (error) {
        console.error('Get team stats error:', error);
        res.status(500).json({ error: 'Failed to get team stats' });
    }
});

module.exports = router;
