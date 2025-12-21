# 🔧 PASSO 1: Connection String do Supabase

## ✅ Informações Coletadas

```
Database Name: postgres
Password: hrTi10ysL3i8PFZqfszX1w8mUuIBq08Z
User: postgres (padrão)
Port: 5432 (padrão)
```

---

## 🎯 Connection Strings Possíveis

### Opção 1: Rede Interna do Coolify (RECOMENDADO)
```
postgresql://postgres:hrTi10ysL3i8PFZqfszX1w8mUuIBq08Z@supabase-db:5432/postgres?schema=public
```

### Opção 2: Localhost (se na mesma VPS)
```
postgresql://postgres:hrTi10ysL3i8PFZqfszX1w8mUuIBq08Z@localhost:5432/postgres?schema=public
```

### Opção 3: Domínio Externo
```
postgresql://postgres:hrTi10ysL3i8PFZqfszX1w8mUuIBq08Z@db.otimizacut.com.br:5432/postgres?schema=public
```

---

## 🧪 TESTAR A CONEXÃO

### Via SSH na VPS:

```bash
# Conectar na VPS
ssh root@seu-ip-vps

# Instalar cliente PostgreSQL (se não tiver)
apt install -y postgresql-client

# Testar Opção 1 (rede interna)
psql "postgresql://postgres:hrTi10ysL3i8PFZqfszX1w8mUuIBq08Z@supabase-db:5432/postgres"

# Se não funcionar, testar Opção 2 (localhost)
psql "postgresql://postgres:hrTi10ysL3i8PFZqfszX1w8mUuIBq08Z@localhost:5432/postgres"

# Se não funcionar, testar Opção 3 (domínio)
psql "postgresql://postgres:hrTi10ysL3i8PFZqfszX1w8mUuIBq08Z@db.otimizacut.com.br:5432/postgres"
```

Se conectar com sucesso, você verá:
```
postgres=#
```

Digite `\q` para sair.

---

## ✅ Qual Connection String Usar?

**Me diga qual das 3 opções funcionou**, ou se nenhuma funcionou.

Também me diga:
- Você vai fazer deploy do NexusPM **no Coolify** ou **manualmente na VPS**?

---

## 📋 Próximo Passo

Depois de confirmar qual connection string funciona, vamos:

1. Configurar o `.env` do NexusPM
2. Rodar `npx prisma db push` para criar as tabelas
3. Rodar `npm run db:seed` para criar usuários iniciais
4. Fazer o deploy!

**Qual opção de connection string funcionou?**
