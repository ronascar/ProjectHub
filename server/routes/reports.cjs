const express = require('express');
const { authMiddleware } = require('../middleware/auth.cjs');

const router = express.Router();

// GET /api/reports/data - Get report data with filters
router.get('/data', authMiddleware, async (req, res) => {
    try {
        const { clientId, projectId, userId, startDate, endDate, reportType } = req.query;

        // Build where clause for filtering
        const projectWhere = { isArchived: false };
        if (clientId && clientId !== 'all') projectWhere.clientId = clientId;
        if (projectId && projectId !== 'all') projectWhere.id = projectId;

        const taskWhere = {};
        if (userId && userId !== 'all') taskWhere.assigneeId = userId;
        if (startDate) taskWhere.createdAt = { gte: new Date(startDate) };
        if (endDate) {
            taskWhere.createdAt = taskWhere.createdAt
                ? { ...taskWhere.createdAt, lte: new Date(endDate) }
                : { lte: new Date(endDate) };
        }

        // Get projects with their tasks
        const projects = await req.prisma.project.findMany({
            where: projectWhere,
            include: {
                client: { select: { id: true, name: true } },
                owner: { select: { id: true, name: true, avatar: true } },
                tasks: {
                    where: taskWhere,
                    include: {
                        assignee: { select: { id: true, name: true, avatar: true } }
                    }
                },
                members: {
                    include: {
                        user: { select: { id: true, name: true, avatar: true } }
                    }
                }
            },
            orderBy: { updatedAt: 'desc' }
        });

        // Transform data for reports
        const reportData = [];

        projects.forEach(project => {
            // Group tasks by assignee
            const tasksByUser = new Map();

            project.tasks.forEach(task => {
                const userId = task.assigneeId || 'unassigned';
                const userName = task.assignee?.name || 'Não atribuído';
                const userAvatar = task.assignee?.avatar;

                if (!tasksByUser.has(userId)) {
                    tasksByUser.set(userId, {
                        userId,
                        userName,
                        userAvatar,
                        tasks: [],
                        totalHours: 0,
                        completedTasks: 0,
                        totalTasks: 0
                    });
                }

                const userStats = tasksByUser.get(userId);
                userStats.tasks.push(task);
                userStats.totalTasks++;

                if (task.status === 'DONE') {
                    userStats.completedTasks++;
                }

                // Calculate hours if available
                if (task.actualHours) {
                    userStats.totalHours += task.actualHours;
                } else if (task.estimatedHours) {
                    userStats.totalHours += task.estimatedHours;
                }
            });

            // Create report entry for each user in the project
            tasksByUser.forEach((stats, userId) => {
                reportData.push({
                    id: `${project.id}-${userId}`,
                    projectId: project.id,
                    projectName: project.name,
                    projectStatus: project.status,
                    clientId: project.client?.id,
                    clientName: project.client?.name || 'Sem cliente',
                    userId: stats.userId,
                    userName: stats.userName,
                    userAvatar: stats.userAvatar,
                    totalHours: stats.totalHours,
                    completedTasks: stats.completedTasks,
                    totalTasks: stats.totalTasks,
                    completionRate: stats.totalTasks > 0
                        ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
                        : 0,
                    budget: project.budget ? parseFloat(project.budget) : 0,
                    progress: project.progress,
                    dueDate: project.dueDate,
                    priority: project.priority
                });
            });
        });

        res.json(reportData);
    } catch (error) {
        console.error('Report data error:', error);
        res.status(500).json({ error: 'Failed to load report data' });
    }
});

// GET /api/reports/summary - Get summary statistics for reports
router.get('/summary', authMiddleware, async (req, res) => {
    try {
        const { clientId, projectId, userId, startDate, endDate } = req.query;

        const projectWhere = { isArchived: false };
        if (clientId && clientId !== 'all') projectWhere.clientId = clientId;
        if (projectId && projectId !== 'all') projectWhere.id = projectId;

        const taskWhere = {};
        if (userId && userId !== 'all') taskWhere.assigneeId = userId;
        if (startDate) taskWhere.createdAt = { gte: new Date(startDate) };
        if (endDate) {
            taskWhere.createdAt = taskWhere.createdAt
                ? { ...taskWhere.createdAt, lte: new Date(endDate) }
                : { lte: new Date(endDate) };
        }

        const [totalProjects, totalBudget, tasks] = await Promise.all([
            req.prisma.project.count({ where: projectWhere }),
            req.prisma.project.aggregate({
                where: projectWhere,
                _sum: { budget: true }
            }),
            req.prisma.task.findMany({
                where: { ...taskWhere, project: projectWhere },
                select: {
                    status: true,
                    actualHours: true,
                    estimatedHours: true
                }
            })
        ]);

        const completedTasks = tasks.filter(t => t.status === 'DONE').length;
        const totalTasks = tasks.length;
        const totalHours = tasks.reduce((sum, t) => sum + (t.actualHours || t.estimatedHours || 0), 0);

        res.json({
            totalProjects,
            totalTasks,
            completedTasks,
            totalHours,
            totalBudget: totalBudget._sum.budget ? parseFloat(totalBudget._sum.budget) : 0,
            completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
        });
    } catch (error) {
        console.error('Report summary error:', error);
        res.status(500).json({ error: 'Failed to load report summary' });
    }
});

// GET /api/reports/export - Export report data
router.get('/export', authMiddleware, async (req, res) => {
    try {
        const { format, clientId, projectId, userId } = req.query;

        // Get report data with same filters
        const projectWhere = { isArchived: false };
        if (clientId && clientId !== 'all') projectWhere.clientId = clientId;
        if (projectId && projectId !== 'all') projectWhere.id = projectId;

        const taskWhere = {};
        if (userId && userId !== 'all') taskWhere.assigneeId = userId;

        const projects = await req.prisma.project.findMany({
            where: projectWhere,
            include: {
                client: true,
                tasks: {
                    where: taskWhere,
                    include: {
                        assignee: { select: { name: true } }
                    }
                }
            }
        });

        // For now, return JSON (can be extended for CSV, Excel, PDF)
        if (format === 'json') {
            return res.json(projects);
        }

        // CSV format
        if (format === 'csv') {
            const csvRows = ['Projeto,Cliente,Tarefas Totais,Tarefas Concluídas,Horas,Status'];

            projects.forEach(project => {
                const totalTasks = project.tasks.length;
                const completedTasks = project.tasks.filter(t => t.status === 'DONE').length;
                const totalHours = project.tasks.reduce((sum, t) => sum + (t.actualHours || t.estimatedHours || 0), 0);

                csvRows.push([
                    project.name,
                    project.client?.name || 'Sem cliente',
                    totalTasks,
                    completedTasks,
                    totalHours.toFixed(2),
                    project.status
                ].join(','));
            });

            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', `attachment; filename="relatorio-${Date.now()}.csv"`);
            return res.send(csvRows.join('\n'));
        }

        res.status(400).json({ error: 'Invalid export format' });
    } catch (error) {
        console.error('Export error:', error);
        res.status(500).json({ error: 'Failed to export report' });
    }
});

module.exports = router;
