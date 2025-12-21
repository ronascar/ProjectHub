# 🔧 Configurar NexusPM com Supabase (Coolify)

## 📋 Como Encontrar a Connection String no Coolify

### PASSO 1: Acessar Coolify Dashboard

1. Acesse seu Coolify: `https://seu-coolify.com`
2. Faça login
3. Vá em **Resources** ou **Applications**
4. Encontre o **Supabase**

### PASSO 2: Ver Variáveis de Ambiente

1. Clique no Supabase
2. Vá em **Environment Variables** ou **Configuration**
3. Procure por uma dessas variáveis:

```
DATABASE_URL
POSTGRES_PASSWORD
DB_PASSWORD
SUPABASE_DB_PASSWORD
```

### PASSO 3: Montar a Connection String

A connection string geralmente é:

```
postgresql://postgres:[SENHA]@[HOST]:5432/postgres?schema=public
```

**Onde:**
- `[SENHA]` = Valor de `POSTGRES_PASSWORD` ou `DB_PASSWORD`
- `[HOST]` = Pode ser:
  - `localhost` (se na mesma VPS)
  - `supabase-db` (nome do container)
  - `db.otimizacut.com.br` (se configurou domínio)
  - IP interno do container

---

## 🎯 OPÇÃO 1: Connection String Interna (Recomendado)

Se o NexusPM vai rodar na mesma VPS/Coolify:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@supabase-db:5432/postgres?schema=public"
```

Ou:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/postgres?schema=public"
```

---

## 🎯 OPÇÃO 2: Connection String Externa

Se o NexusPM vai rodar em outro lugar:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@db.otimizacut.com.br:5432/postgres?schema=public"
```

---

## 🚀 DEPLOY DO NEXUSPM NO COOLIFY

### Opção A: Deploy Direto no Coolify (RECOMENDADO)

#### 1. Criar Novo Resource no Coolify

1. Coolify Dashboard → **New Resource**
2. Escolha **Application**
3. Conecte seu repositório GitHub

#### 2. Configurar Build

```
Build Pack: Node.js
Build Command: npm install && npx prisma generate && npm run build
Start Command: node server/index.cjs
Port: 3001
```

#### 3. Adicionar Variáveis de Ambiente

```env
# Database (Supabase no Coolify)
DATABASE_URL=postgresql://postgres:SUA_SENHA@supabase-db:5432/postgres?schema=public

# Backend
JWT_SECRET=seu-jwt-secret-super-seguro
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://otimizacut.com.br
CORS_ALLOW_ALL=false

# Supabase API (opcional)
NEXT_PUBLIC_SUPABASE_URL=https://db.otimizacut.com.br
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjI2MjQ4MCwiZXhwIjo0OTIxOTM2MDgwLCJyb2xlIjoiYW5vbiJ9.6wcYhrhuiSuXxi_Er37rbFfF9aMB25UsG8_6WJ714Fc
```

#### 4. Configurar Domínio

1. Em **Domains**, adicione: `otimizacut.com.br`
2. Coolify vai configurar SSL automaticamente

#### 5. Deploy!

Clique em **Deploy** e aguarde.

---

## 🎯 Opção B: Deploy Manual na VPS

Se preferir fazer manual (fora do Coolify):

### 1. Descobrir a senha do PostgreSQL

```bash
# SSH na VPS
ssh root@seu-ip-vps

# Ver containers do Coolify
docker ps | grep supabase

# Ver variáveis do Supabase
docker inspect [CONTAINER_ID] | grep -i password

# Ou ver logs
docker logs [CONTAINER_ID] | grep -i password
```

### 2. Testar conexão

```bash
# Instalar cliente PostgreSQL
apt install -y postgresql-client

# Testar conexão
psql "postgresql://postgres:SENHA@localhost:5432/postgres"
```

Se conectar, a senha está correta!

### 3. Configurar NexusPM

Siga o guia `DEPLOY_HOSTINGER_VPS.md`, mas use a connection string do Supabase.

---

## 🔍 Como Descobrir o Host Correto

### Teste 1: localhost
```bash
psql "postgresql://postgres:SENHA@localhost:5432/postgres"
```

### Teste 2: Nome do container
```bash
psql "postgresql://postgres:SENHA@supabase-db:5432/postgres"
```

### Teste 3: IP do container
```bash
# Descobrir IP do container
docker inspect supabase-db | grep IPAddress

# Testar
psql "postgresql://postgres:SENHA@172.17.0.2:5432/postgres"
```

### Teste 4: Domínio
```bash
psql "postgresql://postgres:SENHA@db.otimizacut.com.br:5432/postgres"
```

---

## 📝 Estrutura Recomendada no Coolify

```
Coolify
├── Supabase (PostgreSQL)
│   └── db.otimizacut.com.br
│
└── NexusPM (Node.js)
    ├── Backend (API)
    └── Frontend (Static)
    └── otimizacut.com.br
```

**Vantagens:**
- ✅ Tudo gerenciado pelo Coolify
- ✅ Deploy automático no git push
- ✅ SSL automático
- ✅ Logs centralizados
- ✅ Fácil de escalar

---

## 🎯 Próximos Passos

### 1. Encontre a senha do PostgreSQL no Coolify

No dashboard do Supabase, procure:
- `POSTGRES_PASSWORD`
- `DB_PASSWORD`
- Ou qualquer variável com "password"

### 2. Monte a connection string

```
postgresql://postgres:[SENHA_AQUI]@supabase-db:5432/postgres?schema=public
```

### 3. Me envie (sem a senha real, só o formato)

Exemplo:
```
postgresql://postgres:****@supabase-db:5432/postgres?schema=public
```

### 4. Vou te ajudar a configurar!

---

## 💡 Dica: Deploy Tudo no Coolify

**Recomendo fazer o deploy do NexusPM também no Coolify:**

**Vantagens:**
- ✅ Mesma rede interna (mais rápido)
- ✅ Não precisa expor porta do PostgreSQL
- ✅ Deploy automático
- ✅ SSL grátis
- ✅ Gerenciamento centralizado

**Quer que eu crie um guia para deploy completo no Coolify?**

---

## 🆘 Precisa de Ajuda?

Me envie:
1. Screenshot das variáveis de ambiente do Supabase no Coolify (pode ocultar senhas)
2. Nome do container do PostgreSQL: `docker ps | grep postgres`
3. Se o NexusPM vai rodar no Coolify ou fora dele

Vou te ajudar a configurar! 🚀
