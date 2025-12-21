require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

// Import routes
const authRoutes = require('./routes/auth.cjs');
const userRoutes = require('./routes/users.cjs');
const projectRoutes = require('./routes/projects.cjs');
const taskRoutes = require('./routes/tasks.cjs');
const clientRoutes = require('./routes/clients.cjs');
const teamRoutes = require('./routes/team.cjs');
const dashboardRoutes = require('./routes/dashboard.cjs');

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Middleware
// Middleware
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    process.env.FRONTEND_URL, // URL do deploy na Vercel
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Permitir requests sem 'origin' (como mobile apps, curl ou postman)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1 || process.env.CORS_ALLOW_ALL === 'true') {
            callback(null, true);
        } else {
            console.log('Origin blocked by CORS:', origin);
            // Em produção você deve bloquear, mas para debug vamos permitir e logar
            // callback(new Error('Not allowed by CORS')); 
            callback(null, false);
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Make prisma available to routes
app.use((req, res, next) => {
    req.prisma = prisma;
    next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/team', teamRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Servir arquivos estáticos do frontend (depois das rotas da API)
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Redirecionar todas as rotas não-API para o index.html (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
});

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 API endpoints available at http://localhost:${PORT}/api`);
});

module.exports = app;
