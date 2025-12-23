const express = require('express');
const { authMiddleware } = require('../middleware/auth.cjs');

const router = express.Router();

// GET /api/messages - List all messages for current user
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const messages = await req.prisma.message.findMany({
            where: {
                OR: [
                    { receiverId: userId },
                    { senderId: userId }
                ]
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        res.json(messages);
    } catch (error) {
        console.error('List messages error:', error);
        res.status(500).json({ error: 'Failed to list messages' });
    }
});

// GET /api/messages/unread-count - Get unread message count
router.get('/unread-count', authMiddleware, async (req, res) => {
    try {
        const count = await req.prisma.message.count({
            where: {
                receiverId: req.user.id,
                isRead: false
            }
        });

        res.json({ count });
    } catch (error) {
        console.error('Unread count error:', error);
        res.status(500).json({ error: 'Failed to get unread count' });
    }
});

// POST /api/messages - Send a message
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { receiverId, content } = req.body;

        if (!receiverId || !content) {
            return res.status(400).json({ error: 'Receiver and content are required' });
        }

        const message = await req.prisma.message.create({
            data: {
                senderId: req.user.id,
                receiverId,
                content
            },
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                receiver: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                }
            }
        });

        res.status(201).json(message);
    } catch (error) {
        console.error('Send message error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// PUT /api/messages/:id/read - Mark message as read
router.put('/:id/read', authMiddleware, async (req, res) => {
    try {
        const message = await req.prisma.message.update({
            where: { id: req.params.id },
            data: { isRead: true }
        });

        res.json(message);
    } catch (error) {
        console.error('Mark read error:', error);
        res.status(500).json({ error: 'Failed to mark message as read' });
    }
});

// PUT /api/messages/read-all - Mark all messages as read
router.put('/read-all', authMiddleware, async (req, res) => {
    try {
        await req.prisma.message.updateMany({
            where: {
                receiverId: req.user.id,
                isRead: false
            },
            data: { isRead: true }
        });

        res.json({ message: 'All messages marked as read' });
    } catch (error) {
        console.error('Mark all read error:', error);
        res.status(500).json({ error: 'Failed to mark all messages as read' });
    }
});

// DELETE /api/messages/:id - Delete a message
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        // Only sender can delete their messages
        const message = await req.prisma.message.findUnique({
            where: { id: req.params.id }
        });

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        if (message.senderId !== req.user.id && message.receiverId !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized to delete this message' });
        }

        await req.prisma.message.delete({
            where: { id: req.params.id }
        });

        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

module.exports = router;
