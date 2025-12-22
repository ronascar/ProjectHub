const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.cjs');

// GET /api/technologies - List all technologies
router.get('/', authMiddleware, async (req, res) => {
    try {
        const technologies = await req.prisma.technology.findMany({
            orderBy: { name: 'asc' }
        });
        res.json(technologies);
    } catch (error) {
        console.error('List technologies error:', error);
        res.status(500).json({ error: 'Failed to fetch technologies' });
    }
});

// POST /api/technologies - Create new technology (admin only)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, icon, color, category } = req.body;

        // Check if technology already exists
        const existing = await req.prisma.technology.findUnique({
            where: { name }
        });

        if (existing) {
            return res.status(400).json({ error: 'Technology already exists' });
        }

        const technology = await req.prisma.technology.create({
            data: { name, icon, color, category }
        });

        res.status(201).json(technology);
    } catch (error) {
        console.error('Create technology error:', error);
        res.status(500).json({ error: 'Failed to create technology' });
    }
});

module.exports = router;
