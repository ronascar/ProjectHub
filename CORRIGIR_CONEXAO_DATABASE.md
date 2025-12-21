# 🔧 Corrigir Conexão com Database

## ❌ Problema

O container do NexusPM não consegue acessar o Supabase pelo IP `10.0.2.6` porque estão em redes Docker diferentes.

## ✅ Solução

Usar o **nome do container** do Supabase em vez do IP.

---

## 🔍 PASSO 1: Descobrir o Nome do Container do Supabase

Na VPS, execute:

```bash
docker ps | grep supabase-db
```

Você vai ver algo como:
```
c0271ced0da4   supabase/postgres:15.8.1.048   ...   supabase-db-bgcwg4k8ckk0skss4w0kgcso
```

O nome do container é: **`supabase-db-bgcwg4k8ckk0skss4w0kgcso`**

---

## 🔧 PASSO 2: Atualizar DATABASE_URL no Coolify

### Opção A: Usar Nome do Container (RECOMENDADO)

No Coolify, edite a variável `DATABASE_URL`:

```
postgresql://postgres:hrTi10y3L3ibPFZqfszX1w8mUuIBq08Z@supabase-db-bgcwg4k8ckk0skss4w0kgcso:5432/postgres?schema=public
```

### Opção B: Conectar os Containers na Mesma Rede

Ou podemos conectar ambos os containers na mesma rede Docker.

---

## 🎯 PASSO 3: Descobrir a Rede do Supabase

```bash
docker inspect supabase-db-bgcwg4k8ckk0skss4w0kgcso | grep NetworkMode
```

Vai aparecer algo como:
```
"NetworkMode": "coolify"
```

Ou:
```
"NetworkMode": "bgcwg4k8ckk0skss4w0kgcso"
```

---

## 🔧 PASSO 4: Conectar NexusPM na Mesma Rede

### 4.1 Descobrir o nome do container do NexusPM

```bash
docker ps | grep nexuspm
```

Ou:
```bash
docker ps | grep noow000ogg08koo80wock0s0
```

### 4.2 Conectar na rede do Supabase

```bash
# Substitua pelos nomes corretos
docker network connect bgcwg4k8ckk0skss4w0kgcso NOME_CONTAINER_NEXUSPM
```

Ou se a rede for "coolify":
```bash
docker network connect coolify NOME_CONTAINER_NEXUSPM
```

---

## ✅ SOLUÇÃO MAIS SIMPLES (RECOMENDADA)

### Use o Nome do Container no DATABASE_URL

1. **Descubra o nome do container do Supabase:**
```bash
docker ps | grep supabase-db
```

2. **Copie o nome completo** (exemplo: `supabase-db-bgcwg4k8ckk0skss4w0kgcso`)

3. **No Coolify, edite DATABASE_URL:**
```
postgresql://postgres:hrTi10y3L3ibPFZqfszX1w8mUuIBq08Z@supabase-db-bgcwg4k8ckk0skss4w0kgcso:5432/postgres?schema=public
```

4. **Clique em Update**

5. **Redeploy**

6. **Teste novamente:**
```bash
npx prisma db push
```

---

## 🧪 Testar Conexão

Dentro do container do NexusPM, teste:

```bash
# Ping pelo nome do container
ping supabase-db-bgcwg4k8ckk0skss4w0kgcso

# Ou teste a conexão PostgreSQL
psql "postgresql://postgres:hrTi10y3L3ibPFZqfszX1w8mUuIBq08Z@supabase-db-bgcwg4k8ckk0skss4w0kgcso:5432/postgres"
```

---

## 📋 Execute Estes Comandos e Me Envie o Resultado:

```bash
# 1. Nome do container do Supabase
docker ps | grep supabase-db

# 2. Nome do container do NexusPM
docker ps | grep nexuspm

# 3. Redes disponíveis
docker network ls

# 4. Rede do Supabase
docker inspect supabase-db-bgcwg4k8ckk0skss4w0kgcso | grep NetworkMode
```

Com essas informações, vou te dar a solução exata! 🚀
