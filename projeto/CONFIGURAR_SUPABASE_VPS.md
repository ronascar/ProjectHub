# 🔧 Configurar NexusPM com Supabase (VPS)

## 📋 Informações do Supabase

Você tem:
```
SUPABASE_URL: https://db.otimizacut.com.br
SUPABASE_ANON_KEY: eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
```

---

## 🎯 PASSO 1: Obter Connection String do PostgreSQL

### Opção A: Via Dashboard do Supabase
1. Acesse: https://db.otimizacut.com.br
2. Vá em: Settings → Database
3. Copie a **Connection String** (formato PostgreSQL)

### Opção B: Via SSH na VPS
```bash
# Conectar na VPS
ssh root@seu-ip-vps

# Verificar configuração do Supabase
cd /caminho/do/supabase
docker ps  # Ver containers rodando

# A connection string geralmente é:
postgresql://postgres:sua_senha@localhost:5432/postgres
```

---

## 🎯 PASSO 2: Configurar o Backend

### 2.1 Conectar via SSH
```bash
ssh root@seu-ip-vps
cd /var/www/nexuspm
```

### 2.2 Editar .env
```bash
nano .env
```

### 2.3 Configurar variáveis
```env
# Database (Supabase PostgreSQL)
DATABASE_URL="postgresql://postgres:SUA_SENHA_SUPABASE@localhost:5432/postgres?schema=public"

# OU se o Supabase estiver em outro container/porta:
# DATABASE_URL="postgresql://postgres:SUA_SENHA_SUPABASE@db.otimizacut.com.br:5432/postgres?schema=public"

# Backend
JWT_SECRET="seu-jwt-secret-super-seguro"
NODE_ENV="production"
PORT=3001
FRONTEND_URL="https://otimizacut.com.br"
CORS_ALLOW_ALL=false

# Supabase (opcional, se quiser usar a API REST também)
NEXT_PUBLIC_SUPABASE_URL="https://db.otimizacut.com.br"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTc2NjI2MjQ4MCwiZXhwIjo0OTIxOTM2MDgwLCJyb2xlIjoiYW5vbiJ9.6wcYhrhuiSuXxi_Er37rbFfF9aMB25UsG8_6WJ714Fc"
```

Salve: `Ctrl+X`, `Y`, `Enter`

---

## 🎯 PASSO 3: Configurar Prisma

### 3.1 Gerar Prisma Client
```bash
npx prisma generate
```

### 3.2 Criar tabelas no banco
```bash
npx prisma db push
```

### 3.3 Popular com dados iniciais
```bash
npm run db:seed
```

### 3.4 Verificar se funcionou
```bash
npx prisma studio
```

Isso abre uma interface web para ver os dados (acesse via túnel SSH se necessário).

---

## 🎯 PASSO 4: Configurar Frontend

### 4.1 Editar .env.production
```bash
nano .env.production
```

Cole:
```env
VITE_API_URL=https://otimizacut.com.br/api
```

Salve: `Ctrl+X`, `Y`, `Enter`

### 4.2 Rebuild frontend
```bash
npm run build
```

---

## 🎯 PASSO 5: Restart Backend

```bash
pm2 restart nexuspm-backend
pm2 logs nexuspm-backend  # Ver se iniciou sem erros
```

---

## 🎯 PASSO 6: Testar

### 6.1 Testar backend
```bash
curl http://localhost:3001/api/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"..."}
```

### 6.2 Testar no navegador
1. Abra: https://otimizacut.com.br
2. Tente fazer login
3. Verifique se funciona

---

## 🔍 Como Descobrir a Connection String do Supabase

### Método 1: Dashboard Web
```
https://db.otimizacut.com.br
→ Settings
→ Database
→ Connection String
```

### Método 2: Arquivo de configuração
```bash
# Na VPS, procure o arquivo .env do Supabase
cd /caminho/instalacao/supabase
cat .env | grep DATABASE_URL
```

### Método 3: Docker
```bash
# Ver variáveis do container
docker inspect supabase-db | grep -i password
docker inspect supabase-db | grep -i postgres
```

### Método 4: Logs do Supabase
```bash
docker logs supabase-db | grep -i password
```

---

## 📝 Formato da Connection String

A connection string deve estar neste formato:

```
postgresql://[USUARIO]:[SENHA]@[HOST]:[PORTA]/[DATABASE]?schema=public
```

**Exemplos:**

```bash
# Se Supabase está na mesma VPS (localhost)
postgresql://postgres:sua_senha@localhost:5432/postgres?schema=public

# Se Supabase está em subdomínio
postgresql://postgres:sua_senha@db.otimizacut.com.br:5432/postgres?schema=public

# Com IP direto
postgresql://postgres:sua_senha@192.168.1.100:5432/postgres?schema=public
```

---

## 🐛 Problemas Comuns

### Erro: "Can't reach database server"

**Solução 1:** Verificar se PostgreSQL está rodando
```bash
docker ps | grep postgres
# ou
systemctl status postgresql
```

**Solução 2:** Verificar porta
```bash
netstat -tlnp | grep 5432
```

**Solução 3:** Testar conexão manualmente
```bash
psql "postgresql://postgres:senha@localhost:5432/postgres"
```

### Erro: "Authentication failed"

**Solução:** Senha incorreta na connection string
```bash
# Resetar senha do PostgreSQL no Supabase
docker exec -it supabase-db psql -U postgres
ALTER USER postgres WITH PASSWORD 'nova_senha';
\q
```

### Erro: "Schema 'public' does not exist"

**Solução:** Criar schema
```bash
psql "postgresql://postgres:senha@localhost:5432/postgres"
CREATE SCHEMA IF NOT EXISTS public;
\q
```

---

## 🔒 Segurança

### 1. Não exponha a porta 5432 publicamente
```bash
# Firewall deve bloquear 5432 de fora
ufw deny 5432
```

### 2. Use senha forte
```bash
# Gerar senha forte
openssl rand -base64 32
```

### 3. Backup regular
```bash
# Criar backup
docker exec supabase-db pg_dump -U postgres postgres > backup_$(date +%Y%m%d).sql

# Ou se PostgreSQL nativo:
pg_dump -U postgres postgres > backup_$(date +%Y%m%d).sql
```

---

## 📊 Próximos Passos

Depois de configurar:

1. ✅ Testar login
2. ✅ Criar projeto de teste
3. ✅ Criar tarefa de teste
4. ✅ Verificar se dados são salvos
5. ✅ Configurar backup automático

---

## ❓ Precisa de Ajuda?

**Me envie:**
1. A connection string que você está usando (sem a senha!)
2. O erro que aparece (se houver)
3. Logs do backend: `pm2 logs nexuspm-backend`

---

**Qual é a connection string do seu Supabase?**

Formato esperado:
```
postgresql://usuario:senha@host:porta/database?schema=public
```
