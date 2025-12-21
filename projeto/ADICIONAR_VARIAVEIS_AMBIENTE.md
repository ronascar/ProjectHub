# 🔧 Adicionar Variáveis de Ambiente no Coolify

## 📋 Você Precisa Adicionar 7 Variáveis

### Como Adicionar:

1. Clique no botão **"+ Add"** (no topo)
2. Para cada variável abaixo, preencha **Name** e **Value**
3. Clique em **Update** ou **Save**

---

## 1️⃣ DATABASE_URL

```
Name: DATABASE_URL
Value: postgresql://postgres:hrTi10y3L3ibPFZqfszX1w8mUuIBq08Z@10.0.2.6:5432/postgres?schema=public
```

**Importante:** Copie exatamente como está acima!

---

## 2️⃣ JWT_SECRET

Primeiro, gere o secret na VPS:
```bash
openssl rand -base64 32
```

Copie o resultado e adicione:
```
Name: JWT_SECRET
Value: [Cole o secret gerado]
```

Exemplo:
```
Value: Kx7mP9nQ2wR5tY8uI1oP3aS6dF4gH7jK9lZ0xC2vB5nM8qW1eR4tY7uI0oP3aS6d
```

---

## 3️⃣ NODE_ENV

```
Name: NODE_ENV
Value: production
```

---

## 4️⃣ PORT

```
Name: PORT
Value: 3001
```

---

## 5️⃣ FRONTEND_URL

```
Name: FRONTEND_URL
Value: https://hub.otimizacut.com.br
```

**Importante:** Sem barra no final!

---

## 6️⃣ CORS_ALLOW_ALL

```
Name: CORS_ALLOW_ALL
Value: false
```

---

## 7️⃣ VITE_API_URL

```
Name: VITE_API_URL
Value: https://hub.otimizacut.com.br/api
```

---

## ✅ Depois de Adicionar Todas

1. Verifique se tem **8 variáveis no total**:
   - NIXPACKS_NODE_VERSION (já tem)
   - DATABASE_URL (nova)
   - JWT_SECRET (nova)
   - NODE_ENV (nova)
   - PORT (nova)
   - FRONTEND_URL (nova)
   - CORS_ALLOW_ALL (nova)
   - VITE_API_URL (nova)

2. Clique em **Redeploy** (no menu da aplicação)

3. Aguarde o deploy (5-10 minutos)

4. Depois execute novamente:
```bash
npx prisma db push
npm run db:seed
```

---

## 🎯 Passo a Passo Visual

```
1. Clique "+ Add"
   ↓
2. Name: DATABASE_URL
   Value: postgresql://postgres:hrTi10y3L3ibPFZqfszX1w8mUuIBq08Z@10.0.2.6:5432/postgres?schema=public
   ↓
3. Clique "Update"
   ↓
4. Repita para as outras 6 variáveis
   ↓
5. Clique "Redeploy"
   ↓
6. Aguarde deploy
   ↓
7. Execute prisma db push
   ↓
8. Execute npm run db:seed
   ↓
9. Teste o site!
```

---

## 🆘 Me Avise Quando:

- [ ] Gerar o JWT_SECRET
- [ ] Adicionar todas as 7 variáveis
- [ ] Fazer redeploy
- [ ] Executar os comandos do Prisma
- [ ] Testar o site

Vou te ajudar em cada etapa! 🚀
