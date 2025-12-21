# 🎯 PASSO 3: Testar Conexão Correta

## ✅ Container Encontrado

```
Nome: supabase-db-bgcwg4k8ckk0skss4w0kgcso
Porta exposta: 0.0.0.0:5432->5432/tcp (via proxy)
```

---

## 🧪 TESTE 1: Via IP do Container (RECOMENDADO)

### Descobrir o IP:
```bash
docker inspect supabase-db-bgcwg4k8ckk0skss4w0kgcso | grep IPAddress
```

Vai aparecer algo como:
```
"IPAddress": "172.17.0.X"
```

### Testar com o IP:
```bash
# Substitua 172.17.0.X pelo IP que apareceu
psql "postgresql://postgres:hrTi10ysL3i8PFZqfszX1w8mUuIBq08Z@172.17.0.X:5432/postgres"
```

---

## 🧪 TESTE 2: Via Nome do Container

```bash
psql "postgresql://postgres:hrTi10ysL3i8PFZqfszX1w8mUuIBq08Z@supabase-db-bgcwg4k8ckk0skss4w0kgcso:5432/postgres"
```

---

## 🧪 TESTE 3: Via Proxy Nginx

O proxy está expondo na porta 5432, então:

```bash
psql "postgresql://postgres:hrTi10ysL3i8PFZqfszX1w8mUuIBq08Z@localhost:5432/postgres"
```

**Mas esse deu erro de senha!** Isso significa que:
- Ou tem outro PostgreSQL rodando no localhost
- Ou a senha está diferente

Vamos verificar a senha correta:

```bash
docker exec supabase-db-bgcwg4k8ckk0skss4w0kgcso env | grep POSTGRES_PASSWORD
```

---

## 📋 Execute Estes Comandos:

```bash
# 1. Descobrir IP do container
docker inspect supabase-db-bgcwg4k8ckk0skss4w0kgcso | grep IPAddress

# 2. Ver senha correta
docker exec supabase-db-bgcwg4k8ckk0skss4w0kgcso env | grep POSTGRES_PASSWORD

# 3. Testar conexão com IP (substitua pelo IP que apareceu)
psql "postgresql://postgres:SENHA_CORRETA@IP_DO_CONTAINER:5432/postgres"
```

---

## 🎯 Me Envie o Resultado

Depois de executar os comandos acima, me envie:
1. O IP do container
2. A senha (se for diferente)
3. Se a conexão funcionou

Aí vou te dar a connection string final! 🚀
