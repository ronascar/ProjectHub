# 🔍 PASSO 2: Descobrir o Host Correto do PostgreSQL

## 📊 Análise dos Testes

```
❌ supabase-db → Nome não resolve
❌ localhost → Senha incorreta (PostgreSQL local diferente)
⏳ db.otimizacut.com.br → Aguardando resultado...
```

---

## 🔍 Descobrir o Container do PostgreSQL

Execute estes comandos na VPS:

### 1. Ver todos os containers
```bash
docker ps
```

Procure por um container com "postgres" ou "supabase" no nome.

### 2. Ver containers do Coolify especificamente
```bash
docker ps | grep -i postgres
docker ps | grep -i supabase
```

### 3. Ver o nome exato do container
```bash
docker ps --format "table {{.Names}}\t{{.Image}}\t{{.Ports}}"
```

### 4. Descobrir o IP do container PostgreSQL
```bash
# Substitua NOME_DO_CONTAINER pelo nome que encontrou
docker inspect NOME_DO_CONTAINER | grep IPAddress
```

---

## 🧪 Testar com o IP do Container

Depois de descobrir o IP (exemplo: 172.17.0.5):

```bash
psql "postgresql://postgres:hrTi10ysL3i8PFZqfszX1w8mUuIBq08Z@172.17.0.5:5432/postgres"
```

---

## 🔍 Alternativa: Ver Porta Exposta

```bash
# Ver se a porta 5432 está exposta
docker ps | grep 5432
```

Se aparecer algo como `0.0.0.0:5432->5432/tcp`, significa que está exposto no localhost.

Nesse caso, o problema é a senha. Vamos verificar:

```bash
# Ver variáveis de ambiente do container
docker inspect NOME_DO_CONTAINER | grep -i password
```

---

## 📋 Me Envie o Resultado de:

```bash
docker ps
```

E também:

```bash
docker ps | grep -i postgres
```

Com essas informações, vou te dar a connection string correta! 🎯
