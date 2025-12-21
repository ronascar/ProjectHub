#!/usr/bin/env node
/**
 * Script de Verificação Pré-Deploy
 * Verifica se tudo está configurado corretamente antes do deploy no Coolify
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuração para deploy no Coolify...\n');

let hasErrors = false;

// 1. Verificar se o arquivo .env existe
console.log('1️⃣ Verificando arquivo .env...');
if (!fs.existsSync('.env')) {
    console.log('   ❌ Arquivo .env não encontrado!');
    hasErrors = true;
} else {
    console.log('   ✅ Arquivo .env encontrado');
    
    // Verificar variáveis obrigatórias
    const envContent = fs.readFileSync('.env', 'utf-8');
    const requiredVars = ['DATABASE_URL', 'PORT', 'JWT_SECRET', 'NODE_ENV'];
    
    requiredVars.forEach(varName => {
        if (envContent.includes(`${varName}=`)) {
            console.log(`   ✅ ${varName} configurado`);
        } else {
            console.log(`   ❌ ${varName} não encontrado!`);
            hasErrors = true;
        }
    });
}

// 2. Verificar nixpacks.toml
console.log('\n2️⃣ Verificando nixpacks.toml...');
if (!fs.existsSync('nixpacks.toml')) {
    console.log('   ❌ nixpacks.toml não encontrado!');
    hasErrors = true;
} else {
    console.log('   ✅ nixpacks.toml encontrado');
}

// 3. Verificar package.json
console.log('\n3️⃣ Verificando package.json...');
if (!fs.existsSync('package.json')) {
    console.log('   ❌ package.json não encontrado!');
    hasErrors = true;
} else {
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    
    if (pkg.scripts && pkg.scripts.build) {
        console.log('   ✅ Script de build encontrado');
    } else {
        console.log('   ❌ Script de build não encontrado!');
        hasErrors = true;
    }
}

// 4. Verificar servidor
console.log('\n4️⃣ Verificando servidor...');
if (!fs.existsSync('server/index.cjs')) {
    console.log('   ❌ server/index.cjs não encontrado!');
    hasErrors = true;
} else {
    console.log('   ✅ Servidor encontrado');
}

// 5. Verificar Prisma
console.log('\n5️⃣ Verificando Prisma...');
if (!fs.existsSync('prisma/schema.prisma')) {
    console.log('   ❌ prisma/schema.prisma não encontrado!');
    hasErrors = true;
} else {
    console.log('   ✅ Schema do Prisma encontrado');
}

// 6. Verificar node_modules
console.log('\n6️⃣ Verificando dependências...');
if (!fs.existsSync('node_modules')) {
    console.log('   ⚠️  node_modules não encontrado - execute: npm install');
} else {
    console.log('   ✅ Dependências instaladas');
}

// Resultado final
console.log('\n' + '='.repeat(50));
if (hasErrors) {
    console.log('❌ Verificação falhou! Corrija os erros acima antes do deploy.');
    process.exit(1);
} else {
    console.log('✅ Tudo pronto para deploy no Coolify!');
    console.log('\n📋 Próximos passos:');
    console.log('1. Configure as variáveis de ambiente no Coolify');
    console.log('2. Faça push para o repositório Git');
    console.log('3. Configure o projeto no Coolify apontando para o repositório');
    console.log('4. Inicie o deploy');
    console.log('5. Verifique os logs de build e runtime');
    process.exit(0);
}
