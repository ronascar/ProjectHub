# 🚀 Deploy NexusPM - Guia Simples

## Arquitetura
Frontend (Vercel) → Backend (Render) → Database (PostgreSQL)

**Tempo:** 30 min | **Custo:** R$ 0,00/mês

---

## PASSO 1: Database (5 min)

1. Acesse https://dashboard.render.com
2. New + → PostgreSQL
3. Configure:
   - Name: `nexuspm-db`
   - Database: `nexuspm`
   - Region: Oregon
   - Plan: Free
4. Create Database
5. **COPIE a Internal Database URL**

---

## PASSO 2: Backend (10 min)

1. No Render: New + → Web Service
2. Conecte seu GitHub
3. Configure:
   - Name: `nexuspm-backend`
   - Build: `npm install && npx prisma generate && npx prisma db push`
   - Start: `node server/index.cjs`
   - Plan: Free

4. **Environment Variables:**
   ```
   DATABASE_URL = [Cole a URL do Passo 1]
   JWT_SECRET = [Gere em https://randomkeygen.com/]
   NODE_ENV = production
   PORT = 10000
   FRONTEND_URL = [Deixe vazio por enquanto]
   CORS_ALLOW_ALL = false
   ```

5. Create Web Service
6. **COPIE a URL do backend** (ex: https://nexuspm-backend.onrender.com)

---

## PASSO 3: Frontend (5 min)

1. Acesse https://vercel.com/dashboard
2. Add New → Project
3. Importe seu repositório
4. Configure:
   - Framework: Vite
   - Build: `npm run build`
   - Output: `dist`

5. **Environment Variable:**
   ```
   VITE_API_URL = [Cole a URL do backend do Passo 2]
   ```

6. Deploy
7. **COPIE a URL do frontend** (ex: https://seu-app.vercel.app)

---

## PASSO 4: Conectar (5 min)

1. Volte ao Render Dashboard
2. Acesse seu backend
3. Environment → Edite `FRONTEND_URL`
4. Cole a URL do frontend do Passo 3
5. Save (vai fazer redeploy automático)

---

## PASSO 5: Testar

1. Abra sua URL da Vercel
2. Tente fazer login
3. Se funcionar: ✅ Deploy concluído!

---

## 🐛 Problemas?

**CORS Error:**
- Verifique se `FRONTEND_URL` no Render está correto (com https://)

**Failed to Fetch:**
- Verifique se `VITE_API_URL` na Vercel está correto

**Backend lento:**
- Normal no free tier (primeira requisição demora ~30s)

---

**Pronto! Seu app está no ar! 🎉**
