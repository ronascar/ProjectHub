require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Clear existing data
    await prisma.message.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.attachment.deleteMany();
    await prisma.taskTag.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.task.deleteMany();
    await prisma.deliverable.deleteMany();
    await prisma.projectTechnology.deleteMany();
    await prisma.technology.deleteMany();
    await prisma.resource.deleteMany();
    await prisma.projectVersion.deleteMany();
    await prisma.projectMember.deleteMany();
    await prisma.project.deleteMany();
    await prisma.client.deleteMany();
    await prisma.session.deleteMany();
    await prisma.calendarEvent.deleteMany();
    await prisma.setting.deleteMany();
    await prisma.user.deleteMany();

    console.log('✓ Cleared existing data');

    // Hash the password
    const hashedPassword = await bcrypt.hash('password123', 12);
    console.log('✓ Password hashed');

    // Create users
    const users = await Promise.all([
        prisma.user.create({
            data: {
                email: 'admin@nexuspm.com',
                password: hashedPassword,
                name: 'Alex Morgan',
                role: 'ADMIN',
                avatar: 'https://i.pravatar.cc/150?img=10',
                department: 'Gestão',
            },
        }),
        prisma.user.create({
            data: {
                email: 'sarah@nexuspm.com',
                password: hashedPassword,
                name: 'Sarah Jenkins',
                role: 'MANAGER',
                avatar: 'https://i.pravatar.cc/150?img=5',
                department: 'Projetos',
            },
        }),
        prisma.user.create({
            data: {
                email: 'michael@nexuspm.com',
                password: hashedPassword,
                name: 'Michael Chen',
                role: 'MEMBER',
                avatar: 'https://i.pravatar.cc/150?img=11',
                department: 'Desenvolvimento',
            },
        }),
        prisma.user.create({
            data: {
                email: 'emma@nexuspm.com',
                password: hashedPassword,
                name: 'Emma Wilson',
                role: 'MEMBER',
                avatar: 'https://i.pravatar.cc/150?img=9',
                department: 'Design',
            },
        }),
        prisma.user.create({
            data: {
                email: 'james@nexuspm.com',
                password: hashedPassword,
                name: 'James Rodriguez',
                role: 'MEMBER',
                avatar: 'https://i.pravatar.cc/150?img=12',
                department: 'QA',
            },
        }),
    ]);

    console.log(`✓ Created ${users.length} users`);

    // Create clients
    const clients = await Promise.all([
        prisma.client.create({
            data: {
                name: 'Acme Corp',
                email: 'contact@acme.com',
                company: 'Acme Corporation',
                contactName: 'Sarah Connor',
                city: 'San Francisco',
                state: 'CA',
                country: 'USA',
            },
        }),
        prisma.client.create({
            data: {
                name: 'TechVision',
                email: 'info@techvision.io',
                company: 'TechVision Inc',
                contactName: 'John Smith',
                city: 'New York',
                state: 'NY',
                country: 'USA',
            },
        }),
        prisma.client.create({
            data: {
                name: 'GlobalMart',
                email: 'projects@globalmart.com',
                company: 'GlobalMart Brasil',
                contactName: 'Maria Silva',
                city: 'São Paulo',
                state: 'SP',
                country: 'Brasil',
            },
        }),
    ]);

    console.log(`✓ Created ${clients.length} clients`);

    // Create technologies
    const technologies = await Promise.all([
        prisma.technology.create({ data: { name: 'React', category: 'Frontend', color: '#61DAFB' } }),
        prisma.technology.create({ data: { name: 'Next.js', category: 'Framework', color: '#000000' } }),
        prisma.technology.create({ data: { name: 'TypeScript', category: 'Language', color: '#3178C6' } }),
        prisma.technology.create({ data: { name: 'Tailwind CSS', category: 'Styling', color: '#06B6D4' } }),
        prisma.technology.create({ data: { name: 'PostgreSQL', category: 'Database', color: '#4169E1' } }),
        prisma.technology.create({ data: { name: 'Node.js', category: 'Backend', color: '#339933' } }),
        prisma.technology.create({ data: { name: 'Prisma', category: 'ORM', color: '#2D3748' } }),
        prisma.technology.create({ data: { name: 'Docker', category: 'DevOps', color: '#2496ED' } }),
        prisma.technology.create({ data: { name: 'Figma', category: 'Design', color: '#F24E1E' } }),
    ]);

    console.log(`✓ Created ${technologies.length} technologies`);

    // Create tags
    const tags = await Promise.all([
        prisma.tag.create({ data: { name: 'Urgente', color: '#EF4444' } }),
        prisma.tag.create({ data: { name: 'Bug', color: '#F97316' } }),
        prisma.tag.create({ data: { name: 'Feature', color: '#22C55E' } }),
        prisma.tag.create({ data: { name: 'Melhoria', color: '#3B82F6' } }),
        prisma.tag.create({ data: { name: 'Documentação', color: '#8B5CF6' } }),
    ]);

    console.log(`✓ Created ${tags.length} tags`);

    // Create projects
    const project1 = await prisma.project.create({
        data: {
            name: 'Redesign Website 2024',
            description: 'Projeto de modernização da identidade visual e arquitetura do site da Acme Corp.',
            shortDescription: 'Modernização da identidade visual e arquitetura do site corporativo.',
            category: 'Web Development',
            status: 'IN_PROGRESS',
            priority: 'HIGH',
            progress: 65,
            startDate: new Date('2024-01-10'),
            estimatedDate: new Date('2024-03-15'),
            dueDate: new Date('2024-03-20'),
            ownerId: users[0].id,
            clientId: clients[0].id,
            color: '#4f46e5',
        },
    });

    const project2 = await prisma.project.create({
        data: {
            name: 'App Mobile E-commerce',
            description: 'Desenvolvimento de aplicativo mobile para plataforma de e-commerce.',
            shortDescription: 'App mobile para plataforma de e-commerce.',
            category: 'Mobile App',
            status: 'IN_PROGRESS',
            priority: 'MEDIUM',
            progress: 40,
            startDate: new Date('2024-02-01'),
            estimatedDate: new Date('2024-05-30'),
            dueDate: new Date('2024-06-15'),
            ownerId: users[1].id,
            clientId: clients[2].id,
            color: '#0ea5e9',
        },
    });

    const project3 = await prisma.project.create({
        data: {
            name: 'Dashboard Analytics',
            description: 'Sistema de dashboard para visualização de métricas e KPIs em tempo real.',
            shortDescription: 'Dashboard de métricas e analytics em tempo real.',
            category: 'Data Analytics',
            status: 'PLANNING',
            priority: 'LOW',
            progress: 10,
            startDate: new Date('2024-03-01'),
            estimatedDate: new Date('2024-06-01'),
            dueDate: new Date('2024-06-30'),
            ownerId: users[0].id,
            clientId: clients[1].id,
            color: '#22c55e',
        },
    });

    const project4 = await prisma.project.create({
        data: {
            name: 'Sistema de Gestão Interno',
            description: 'ERP interno para gestão de processos, recursos humanos e financeiro.',
            shortDescription: 'ERP para gestão de processos internos.',
            category: 'Enterprise',
            status: 'COMPLETED',
            priority: 'HIGH',
            progress: 100,
            startDate: new Date('2023-06-01'),
            estimatedDate: new Date('2023-12-01'),
            dueDate: new Date('2023-12-15'),
            completedAt: new Date('2023-12-10'),
            ownerId: users[1].id,
            color: '#a855f7',
        },
    });

    console.log('✓ Created 4 projects');

    // Add project members
    await prisma.projectMember.createMany({
        data: [
            { projectId: project1.id, userId: users[1].id, role: 'LEAD' },
            { projectId: project1.id, userId: users[2].id, role: 'DEVELOPER' },
            { projectId: project1.id, userId: users[3].id, role: 'DESIGNER' },
            { projectId: project2.id, userId: users[2].id, role: 'LEAD' },
            { projectId: project2.id, userId: users[4].id, role: 'QA' },
            { projectId: project3.id, userId: users[2].id, role: 'DEVELOPER' },
        ],
    });

    console.log('✓ Created project members');

    // Add project technologies
    await prisma.projectTechnology.createMany({
        data: [
            { projectId: project1.id, technologyId: technologies[0].id },
            { projectId: project1.id, technologyId: technologies[1].id },
            { projectId: project1.id, technologyId: technologies[2].id },
            { projectId: project1.id, technologyId: technologies[3].id },
            { projectId: project1.id, technologyId: technologies[4].id },
            { projectId: project2.id, technologyId: technologies[0].id },
            { projectId: project2.id, technologyId: technologies[2].id },
            { projectId: project3.id, technologyId: technologies[0].id },
            { projectId: project3.id, technologyId: technologies[4].id },
        ],
    });

    console.log('✓ Created project technologies');

    // Create deliverables
    await prisma.deliverable.createMany({
        data: [
            { projectId: project1.id, title: 'Design System & UI Kit', description: 'Criação de biblioteca de componentes no Figma.', status: 'COMPLETED', order: 1 },
            { projectId: project1.id, title: 'Desenvolvimento Frontend', description: 'Implementação das páginas institucionais e blog.', status: 'IN_PROGRESS', order: 2 },
            { projectId: project1.id, title: 'Integração CMS', description: 'Configuração de content models e webhooks.', status: 'PENDING', order: 3 },
            { projectId: project1.id, title: 'QA & Homologação', description: 'Testes automatizados e aprovação do cliente.', status: 'PENDING', order: 4 },
            { projectId: project2.id, title: 'Wireframes & Protótipos', description: 'Criação de wireframes e protótipos navegáveis.', status: 'COMPLETED', order: 1 },
            { projectId: project2.id, title: 'Desenvolvimento iOS', description: 'App nativo para iOS.', status: 'IN_PROGRESS', order: 2 },
            { projectId: project2.id, title: 'Desenvolvimento Android', description: 'App nativo para Android.', status: 'PENDING', order: 3 },
        ],
    });

    console.log('✓ Created deliverables');

    // Create resources
    await prisma.resource.createMany({
        data: [
            { projectId: project1.id, name: 'Repositório', type: 'REPOSITORY', url: 'https://github.com/agencia/acme-web' },
            { projectId: project1.id, name: 'Staging Env', type: 'STAGING', url: 'https://staging.acme.com' },
            { projectId: project1.id, name: 'Design File', type: 'DESIGN', url: 'https://figma.com/file/acme-design' },
            { projectId: project2.id, name: 'Repositório Mobile', type: 'REPOSITORY', url: 'https://github.com/agencia/globalmart-app' },
        ],
    });

    console.log('✓ Created resources');

    // Create tasks
    const tasks = await Promise.all([
        prisma.task.create({
            data: {
                title: 'Implementar novo fluxo de autenticação',
                description: 'Atualizar o fluxo de autenticação para suportar OAuth2.0.',
                status: 'IN_PROGRESS',
                priority: 'HIGH',
                projectId: project1.id,
                assigneeId: users[2].id,
                creatorId: users[0].id,
                estimatedHours: 8,
                actualHours: 2.5,
                dueDate: new Date('2024-03-10'),
            },
        }),
        prisma.task.create({
            data: {
                title: 'Criar componentes de UI',
                description: 'Desenvolver componentes reutilizáveis baseados no design system.',
                status: 'DONE',
                priority: 'MEDIUM',
                projectId: project1.id,
                assigneeId: users[3].id,
                creatorId: users[1].id,
                estimatedHours: 16,
                actualHours: 14,
                completedAt: new Date('2024-02-20'),
            },
        }),
        prisma.task.create({
            data: {
                title: 'Configurar CI/CD pipeline',
                description: 'Setup de pipeline de integração e deploy contínuo.',
                status: 'TODO',
                priority: 'MEDIUM',
                projectId: project1.id,
                assigneeId: users[2].id,
                creatorId: users[0].id,
                estimatedHours: 6,
            },
        }),
        prisma.task.create({
            data: {
                title: 'Integrar gateway de pagamento',
                description: 'Implementar integração com Stripe.',
                status: 'IN_PROGRESS',
                priority: 'HIGH',
                projectId: project2.id,
                assigneeId: users[2].id,
                creatorId: users[1].id,
                estimatedHours: 12,
                actualHours: 4,
            },
        }),
        prisma.task.create({
            data: {
                title: 'Testes de usabilidade',
                description: 'Realizar testes de usabilidade com grupo de usuários beta.',
                status: 'TODO',
                priority: 'LOW',
                projectId: project2.id,
                assigneeId: users[4].id,
                creatorId: users[1].id,
                estimatedHours: 8,
            },
        }),
    ]);

    console.log(`✓ Created ${tasks.length} tasks`);

    // Create calendar events
    await prisma.calendarEvent.createMany({
        data: [
            {
                title: 'Sprint Planning',
                description: 'Planejamento do próximo sprint',
                startDate: new Date('2024-03-04T09:00:00'),
                endDate: new Date('2024-03-04T11:00:00'),
                type: 'MEETING',
                color: '#4f46e5',
            },
            {
                title: 'Entrega Acme Website',
                description: 'Data limite para entrega do projeto',
                startDate: new Date('2024-03-20'),
                allDay: true,
                type: 'DEADLINE',
                color: '#ef4444',
            },
            {
                title: 'Review Design',
                description: 'Revisão do design com o cliente',
                startDate: new Date('2024-03-08T14:00:00'),
                endDate: new Date('2024-03-08T15:30:00'),
                type: 'MEETING',
                color: '#22c55e',
            },
        ],
    });

    console.log('✓ Created calendar events');

    // Create settings
    await prisma.setting.createMany({
        data: [
            { key: 'company_name', value: JSON.stringify('NexusPM'), category: 'general' },
            { key: 'timezone', value: JSON.stringify('America/Sao_Paulo'), category: 'general' },
            { key: 'date_format', value: JSON.stringify('DD/MM/YYYY'), category: 'general' },
            { key: 'theme', value: JSON.stringify('dark'), category: 'appearance' },
        ],
    });

    console.log('✓ Created settings');

    console.log('\n🎉 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
