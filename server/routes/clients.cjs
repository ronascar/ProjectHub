const express = require('express');
const { authMiddleware, managerMiddleware } = require('../middleware/auth.cjs');

const router = express.Router();

// GET /api/clients - List all clients
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { search, isActive } = req.query;

        const where = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { company: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (isActive !== undefined) where.isActive = isActive === 'true';

        const clients = await req.prisma.client.findMany({
            where,
            include: {
                _count: {
                    select: { projects: true }
                }
            },
            orderBy: { name: 'asc' }
        });

        res.json(clients);
    } catch (error) {
        console.error('List clients error:', error);
        res.status(500).json({ error: 'Failed to list clients' });
    }
});

// GET /api/clients/:id - Get client by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const client = await req.prisma.client.findUnique({
            where: { id: req.params.id },
            include: {
                projects: {
                    select: {
                        id: true,
                        name: true,
                        status: true,
                        progress: true,
                        dueDate: true
                    },
                    orderBy: { createdAt: 'desc' }
                }
            }
        });

        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        res.json(client);
    } catch (error) {
        console.error('Get client error:', error);
        res.status(500).json({ error: 'Failed to get client' });
    }
});

// POST /api/clients - Create client
router.post('/', authMiddleware, managerMiddleware, async (req, res) => {
    try {
        const {
            name, email, phone, company, address, city, state, country,
            logo, contactName, notes
        } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Client name is required' });
        }

        const client = await req.prisma.client.create({
            data: {
                name,
                email,
                phone,
                company,
                address,
                city,
                state,
                country,
                logo,
                contactName,
                notes
            }
        });

        res.status(201).json(client);
    } catch (error) {
        console.error('Create client error:', error);
        res.status(500).json({ error: 'Failed to create client' });
    }
});

// PUT /api/clients/:id - Update client
router.put('/:id', authMiddleware, managerMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name, email, phone, company, address, city, state, country,
            logo, contactName, notes, isActive
        } = req.body;

        const updateData = {
            name, email, phone, company, address, city, state, country,
            logo, contactName, notes, isActive
        };

        // Remove undefined values
        Object.keys(updateData).forEach(key =>
            updateData[key] === undefined && delete updateData[key]
        );

        const client = await req.prisma.client.update({
            where: { id },
            data: updateData
        });

        res.json(client);
    } catch (error) {
        console.error('Update client error:', error);
        res.status(500).json({ error: 'Failed to update client' });
    }
});

// DELETE /api/clients/:id - Delete client
router.delete('/:id', authMiddleware, managerMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // Check if client has projects
        const projects = await req.prisma.project.count({
            where: { clientId: id }
        });

        if (projects > 0) {
            // Soft delete
            await req.prisma.client.update({
                where: { id },
                data: { isActive: false }
            });
            return res.json({ message: 'Client deactivated (has projects)' });
        }

        await req.prisma.client.delete({
            where: { id }
        });

        res.json({ message: 'Client deleted successfully' });
    } catch (error) {
        console.error('Delete client error:', error);
        res.status(500).json({ error: 'Failed to delete client' });
    }
});

module.exports = router;
