const express = require('express');
const bcrypt = require('bcryptjs');
const { authMiddleware, adminMiddleware } = require('../middleware/auth.cjs');

const router = express.Router();

// GET /api/users - List all users
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { search, role, department, isActive } = req.query;

        const where = {};

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } }
            ];
        }

        if (role) where.role = role;
        if (department) where.department = { contains: department, mode: 'insensitive' };
        if (isActive !== undefined) where.isActive = isActive === 'true';

        const users = await req.prisma.user.findMany({
            where,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
                department: true,
                phone: true,
                isActive: true,
                createdAt: true,
                lastLogin: true,
                _count: {
                    select: {
                        assignedTasks: true,
                        ownedProjects: true
                    }
                }
            },
            orderBy: { name: 'asc' }
        });

        res.json(users);
    } catch (error) {
        console.error('List users error:', error);
        res.status(500).json({ error: 'Failed to list users' });
    }
});

// GET /api/users/:id - Get user by ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const user = await req.prisma.user.findUnique({
            where: { id: req.params.id },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
                department: true,
                phone: true,
                isActive: true,
                createdAt: true,
                lastLogin: true,
                ownedProjects: {
                    select: {
                        id: true,
                        name: true,
                        status: true
                    }
                },
                projectMembers: {
                    select: {
                        role: true,
                        project: {
                            select: {
                                id: true,
                                name: true,
                                status: true
                            }
                        }
                    }
                },
                assignedTasks: {
                    where: { status: { not: 'DONE' } },
                    select: {
                        id: true,
                        title: true,
                        status: true,
                        priority: true
                    },
                    take: 10
                }
            }
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user' });
    }
});

// POST /api/users - Create user (Admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { email, password, name, role, department, phone, avatar } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ error: 'Email, password and name are required' });
        }

        // Check if email exists
        const existing = await req.prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (existing) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await req.prisma.user.create({
            data: {
                email: email.toLowerCase(),
                password: hashedPassword,
                name,
                role: role || 'MEMBER',
                department,
                phone,
                avatar
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
                department: true,
                phone: true,
                isActive: true,
                createdAt: true
            }
        });

        res.status(201).json(user);
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});

// PUT /api/users/:id - Update user
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, department, phone, avatar, role, isActive, password } = req.body;

        // Only admin can update role and isActive, or update other users
        if (req.user.id !== id && req.user.role !== 'ADMIN') {
            return res.status(403).json({ error: 'Not authorized to update this user' });
        }

        const updateData = { name, department, phone, avatar };

        // Only admin can update these fields
        if (req.user.role === 'ADMIN') {
            if (role !== undefined) updateData.role = role;
            if (isActive !== undefined) updateData.isActive = isActive;
        }

        // Hash password if provided
        if (password && password.trim() !== '') {
            updateData.password = await bcrypt.hash(password, 12);
        }

        // Remove undefined values
        Object.keys(updateData).forEach(key =>
            updateData[key] === undefined && delete updateData[key]
        );

        const user = await req.prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                avatar: true,
                department: true,
                phone: true,
                isActive: true,
                updatedAt: true
            }
        });

        res.json(user);
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Failed to update user' });
    }
});

// DELETE /api/users/:id - Delete user (Admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const { id } = req.params;

        // Prevent deleting yourself
        if (id === req.user.id) {
            return res.status(400).json({ error: 'Cannot delete your own account' });
        }

        await req.prisma.user.delete({
            where: { id }
        });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Failed to delete user' });
    }
});

module.exports = router;
