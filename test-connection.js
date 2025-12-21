#!/usr/bin/env node

/**
 * Script para testar conexão com o banco de dados e backend
 * Execute: node test-connection.js
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testDatabaseConnection() {
    console.log('🔍 Testando conexão com o banco de dados...\n');
    
    try {
        // Testar conexão
        await prisma.$connect();
        console.log('✅ Conexão com banco de dados estabelecida!');
        
        // Contar usuários
        const userCount = await prisma.user.count();
        console.log(`📊 Total de usuários no banco: ${userCount}`);
        
        // Listar usuários
        if (userCount > 0) {
            const users = await prisma.user.findMany({
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    isActive: true
                },
                take: 5
            });
            
            console.log('\n👥 Primeiros usuários:');
            users.forEach(user => {
                console.log(`  - ${user.name} (${user.email}) - ${user.role} - ${user.isActive ? 'Ativo' : 'Inativo'}`);
            });
        } else {
            console.log('\n⚠️  Nenhum usuário encontrado. Execute: npm run db:seed');
        }
        
        // Contar projetos
        const projectCount = await prisma.project.count();
        console.log(`\n📁 Total de projetos: ${projectCount}`);
        
        // Contar tarefas
        const taskCount = await prisma.task.count();
        console.log(`✅ Total de tarefas: ${taskCount}`);
        
        console.log('\n✨ Teste concluído com sucesso!\n');
        
    } catch (error) {
        console.error('❌ Erro ao conectar com o banco de dados:');
        console.error(error.message);
        console.error('\n💡 Verifique:');
        console.error('  1. Se o arquivo .env existe e está configurado corretamente');
        console.error('  2. Se o banco de dados está acessível');
        console.error('  3. Se as credenciais estão corretas');
        console.error('  4. Se o Prisma Client foi gerado: npm run db:generate\n');
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

async function testEnvironmentVariables() {
    console.log('🔍 Verificando variáveis de ambiente...\n');
    
    const requiredVars = [
        'DATABASE_URL',
        'JWT_SECRET',
        'PORT'
    ];
    
    const optionalVars = [
        'NODE_ENV',
        'FRONTEND_URL',
        'VITE_API_URL'
    ];
    
    let hasErrors = false;
    
    console.log('📋 Variáveis obrigatórias:');
    requiredVars.forEach(varName => {
        if (process.env[varName]) {
            console.log(`  ✅ ${varName}: ${varName === 'DATABASE_URL' || varName === 'JWT_SECRET' ? '[OCULTO]' : process.env[varName]}`);
        } else {
            console.log(`  ❌ ${varName}: NÃO DEFINIDA`);
            hasErrors = true;
        }
    });
    
    console.log('\n📋 Variáveis opcionais:');
    optionalVars.forEach(varName => {
        if (process.env[varName]) {
            console.log(`  ✅ ${varName}: ${process.env[varName]}`);
        } else {
            console.log(`  ⚠️  ${varName}: não definida (opcional)`);
        }
    });
    
    if (hasErrors) {
        console.error('\n❌ Algumas variáveis obrigatórias não estão definidas!');
        console.error('💡 Copie o arquivo .env.example para .env e configure as variáveis.\n');
        process.exit(1);
    }
    
    console.log('\n✨ Todas as variáveis obrigatórias estão definidas!\n');
}

async function main() {
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║   🧪 TESTE DE CONEXÃO - NexusPM Backend      ║');
    console.log('╚════════════════════════════════════════════════╝\n');
    
    // Testar variáveis de ambiente
    await testEnvironmentVariables();
    
    // Testar conexão com banco
    await testDatabaseConnection();
    
    console.log('╔════════════════════════════════════════════════╗');
    console.log('║   ✅ TODOS OS TESTES PASSARAM!                ║');
    console.log('╚════════════════════════════════════════════════╝\n');
    console.log('🚀 Você pode prosseguir com o deploy!\n');
}

main();
