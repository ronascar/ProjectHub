const express = require('express');
const { authMiddleware } = require('../middleware/auth.cjs');

const router = express.Router();

// GET /api/dashboard - Get dashboard data
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        // Get counts
        const [
            totalProjects,
            activeProjects,
            completedProjects,
            totalTasks,
            completedTasks,
            myTasks,
            totalClients,
            totalMembers
        ] = await Promise.all([
            req.prisma.project.count({ where: { isArchived: false } }),
            req.prisma.project.count({ where: { status: 'IN_PROGRESS', isArchived: false } }),
            req.prisma.project.count({ where: { status: 'COMPLETED', isArchived: false } }),
            req.prisma.task.count(),
            req.prisma.task.count({ where: { status: 'DONE' } }),
            req.prisma.task.count({ where: { assigneeId: userId, status: { not: 'DONE' } } }),
            req.prisma.client.count({ where: { isActive: true } }),
            req.prisma.user.count({ where: { isActive: true } })
        ]);

        // Get recent projects
        const recentProjects = await req.prisma.project.findMany({
            where: { isArchived: false },
            select: {
                id: true,
                name: true,
                status: true,
                priority: true,
                progress: true,
                dueDate: true,
                color: true,
                client: { select: { name: true } },
                members: {
                    select: {
                        user: { select: { id: true, avatar: true } }
                    },
                    take: 4
                }
            },
            orderBy: { updatedAt: 'desc' },
            take: 5
        });

        // Get my upcoming tasks
        const upcomingTasks = await req.prisma.task.findMany({
            where: {
                assigneeId: userId,
                status: { not: 'DONE' }
            },
            select: {
                id: true,
                title: true,
                status: true,
                priority: true,
                dueDate: true,
                project: { select: { id: true, name: true, color: true } }
            },
            orderBy: { dueDate: 'asc' },
            take: 5
        });

        // Get recent activities
        const recentActivities = await req.prisma.activity.findMany({
            include: {
                user: { select: { id: true, name: true, avatar: true } },
                project: { select: { id: true, name: true } }
            },
            orderBy: { createdAt: 'desc' },
            take: 10
        });

        // Get notifications for current user
        const notifications = await req.prisma.notification.findMany({
            where: { userId, isRead: false },
            orderBy: { createdAt: 'desc' },
            take: 5
        });

        // Get project status distribution
        const projectsByStatus = await req.prisma.project.groupBy({
            by: ['status'],
            where: { isArchived: false },
            _count: true
        });

        // Get task status distribution
        const tasksByStatus = await req.prisma.task.groupBy({
            by: ['status'],
            _count: true
        });

        // Get upcoming deadlines
        const upcomingDeadlines = await req.prisma.project.findMany({
            where: {
                isArchived: false,
                status: { not: 'COMPLETED' },
                dueDate: {
                    gte: new Date(),
                    lte: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // Next 14 days
                }
            },
            select: {
                id: true,
                name: true,
                dueDate: true,
                progress: true,
                color: true
            },
            orderBy: { dueDate: 'asc' },
            take: 5
        });

        res.json({
            stats: {
                totalProjects,
                activeProjects,
                completedProjects,
                totalTasks,
                completedTasks,
                taskCompletionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
                myPendingTasks: myTasks,
                totalClients,
                totalMembers
            },
            recentProjects,
            upcomingTasks,
            recentActivities,
            notifications,
            charts: {
                projectsByStatus,
                tasksByStatus
            },
            upcomingDeadlines
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ error: 'Failed to load dashboard data' });
    }
});

// GET /api/dashboard/calendar - Get calendar events
router.get('/calendar', authMiddleware, async (req, res) => {
    try {
        const { start, end } = req.query;

        const where = {};
        if (start) where.startDate = { gte: new Date(start) };
        if (end) where.endDate = { lte: new Date(end) };

        const events = await req.prisma.calendarEvent.findMany({
            where,
            orderBy: { startDate: 'asc' }
        });

        // Also get project deadlines as events
        const projectDeadlines = await req.prisma.project.findMany({
            where: {
                isArchived: false,
                dueDate: { not: null }
            },
            select: {
                id: true,
                name: true,
                dueDate: true,
                color: true
            }
        });

        // Convert project deadlines to events
        const deadlineEvents = projectDeadlines.map(p => ({
            id: `project-${p.id}`,
            title: `Deadline: ${p.name}`,
            startDate: p.dueDate,
            endDate: p.dueDate,
            type: 'DEADLINE',
            color: p.color || '#ef4444',
            allDay: true,
            projectId: p.id
        }));

        res.json([...events, ...deadlineEvents]);
    } catch (error) {
        console.error('Calendar error:', error);
        res.status(500).json({ error: 'Failed to load calendar data' });
    }
});

// POST /api/dashboard/calendar - Create calendar event
router.post('/calendar', authMiddleware, async (req, res) => {
    try {
        const { title, description, startDate, endDate, allDay, type, color, location } = req.body;

        if (!title || !startDate) {
            return res.status(400).json({ error: 'Title and start date are required' });
        }

        const event = await req.prisma.calendarEvent.create({
            data: {
                title,
                description,
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                allDay: allDay || false,
                type: type || 'MEETING',
                color,
                location
            }
        });

        res.status(201).json(event);
    } catch (error) {
        console.error('Create event error:', error);
        res.status(500).json({ error: 'Failed to create event' });
    }
});

// GET /api/dashboard/notifications - Get user notifications
router.get('/notifications', authMiddleware, async (req, res) => {
    try {
        const notifications = await req.prisma.notification.findMany({
            where: { userId: req.user.id },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        res.json(notifications);
    } catch (error) {
        console.error('Notifications error:', error);
        res.status(500).json({ error: 'Failed to load notifications' });
    }
});

// PUT /api/dashboard/notifications/:id/read - Mark notification as read
router.put('/notifications/:id/read', authMiddleware, async (req, res) => {
    try {
        await req.prisma.notification.update({
            where: { id: req.params.id },
            data: { isRead: true }
        });

        res.json({ message: 'Notification marked as read' });
    } catch (error) {
        console.error('Mark notification read error:', error);
        res.status(500).json({ error: 'Failed to mark notification as read' });
    }
});

// PUT /api/dashboard/notifications/read-all - Mark all notifications as read
router.put('/notifications/read-all', authMiddleware, async (req, res) => {
    try {
        await req.prisma.notification.updateMany({
            where: { userId: req.user.id, isRead: false },
            data: { isRead: true }
        });

        res.json({ message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Mark all notifications read error:', error);
        res.status(500).json({ error: 'Failed to mark notifications as read' });
    }
});

module.exports = router;
