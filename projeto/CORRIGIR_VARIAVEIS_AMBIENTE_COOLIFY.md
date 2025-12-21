# Correção: Variáveis de Ambiente no Coolify

## Problema Identificado

Após o deploy no Coolify, o sistema apresentava erro 500 no login com a seguinte mensagem nos logs:

```
[dotenv@17.2.3] injecting env (0) from .env
Error validating datasource `db`: the URL must start with the protocol `postgresql://` or `postgres://`
```

**Causa raiz**: O `dotenv` estava carregando 0 variáveis porque:
1. O Coolify passa variáveis de ambiente diretamente para o container (não via arquivo `.env`)
2. O código estava tentando carregar um arquivo `.env` que não existe no container
3. As variáveis do sistema não estavam sendo reconhecidas pelo Prisma

## Solução Implementada

### 1. Ajuste no `server/index.cjs`

Modificado o carregamento do dotenv para ser opcional:

```javascript
// Carregar dotenv apenas se o arquivo .env existir (desenvolvimento local)
// Em produção (Coolify), as variáveis vêm do sistema
try {
    require('dotenv').config();
} catch (e) {
    // Ignorar erro se dotenv não estiver disponível
}

// Log das variáveis críticas para debug
console.log('🔍 Environment check:');
console.log('  NODE_ENV:', process.env.NODE_ENV);
console.log('  PORT:', process.env.PORT);
console.log('  DATABASE_URL:', process.env.DATABASE_URL ? '✅ Configured' : '❌ Missing');
console.log('  JWT_SECRET:', process.env.JWT_SECRET ? '✅ Configured' : '❌ Missing');
console.log('  FRONTEND_URL:', process.env.FRONTEND_URL || 'Not set');
```

### 2. Variáveis de Ambiente no Coolify

Certifique-se de que as seguintes variáveis estão configuradas no Coolify:

```bash
# Database
DATABASE_URL=postgresql://postgres:hrTi10y3L3ibPFZqfszX1w8mUuIBq08Z@10.0.2.6:5432/postgres?schema=public

# Server
PORT=3001
NODE_ENV=production
JWT_SECRET=sa8I1agzwZ9TsCjR258zjm1F9Oij6qfvGDvEedJ99y0=

# Frontend
FRONTEND_URL=https://hub.otimizacut.com.br
VITE_API_URL=https://hub.otimizacut.com.br/api

# Supabase Storage
VITE_SUPABASE_URL=https://jjp.stoneysys.com.br
VITE_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...

# CORS
CORS_ALLOW_ALL=true
```

**IMPORTANTE**: Use o IP do container Supabase DB (`10.0.2.6`) ao invés do nome do container na `DATABASE_URL`.

### 3. Como Descobrir o IP do Container Supabase

```bash
docker inspect supabase-db-bgcwg4k8ckk0skss4w0kgcso | grep IPAddress
```

### 4. Testar Conexão

```bash
# Testar conectividade
nc -zv 10.0.2.6 5432

# Ver logs do container NexusPM
docker logs -f --tail 100 noow000ogg08koo80wock0s0-225527391696
```

## Verificação Pós-Deploy

Após o deploy, verifique nos logs se as variáveis estão sendo carregadas:

```
🔍 Environment check:
  NODE_ENV: production
  PORT: 3001
  DATABASE_URL: ✅ Configured
  JWT_SECRET: ✅ Configured
  FRONTEND_URL: https://hub.otimizacut.com.br
```

Se alguma variável aparecer como `❌ Missing`, configure-a no Coolify e faça redeploy.

## Arquivos Modificados

- `server/index.cjs` - Carregamento opcional do dotenv + logs de debug
- `nixpacks.toml` - Mantido sem alterações (configuração correta)

## Próximos Passos

1. Aguardar o deploy automático no Coolify
2. Verificar os logs para confirmar que as variáveis estão sendo carregadas
3. Testar o login no sistema
4. Confirmar que o Prisma consegue conectar ao banco de dados
