# 🚀 Guia de Deploy Separado - NexusPM

## Arquitetura
- **Frontend**: Vercel (React + Vite)
- **Backend**: Render (Node.js + Express + Prisma)
- **Database**: Render PostgreSQL

---

## 📋 Pré-requisitos

- [ ] Conta no GitHub
- [ ] Conta na Vercel (https://vercel.com)
- [ ] Conta na Render (https://render.com)
- [ ] Código no GitHub

---

## 🎯 PARTE 1: Deploy do Backend (Render)

### Passo 1: Criar PostgreSQL Database

1. Acesse https://dashboard.render.com
2. Clique em **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `nexuspm-database`
   - **Database**: `nexuspm`
   - **User**: `nexuspm_user`
   - **Region**: Oregon (US West)
   - **Plan**: Free
4. Clique em **"Create Database"**
5. **IMPORTANTE**: Copie a **Internal Database URL** (começa com `postgresql://`)

### Passo 2: Deploy do Backend

1. No Render Dashboard, clique em **"New +"** → **"Web Service"**
2. Conecte seu repositório GitHub
3. Configure:

   **Basic Settings:**
   - **Name**: `nexuspm-backend`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: deixe vazio
   - **Runtime**: Node
   - **Build Command**: 
     ```bash
     npm install && npx prisma generate && npx prisma db push
     ```
   - **Start Command**: 
     ```bash
     node server/index.cjs
     ```

   **Advanced Settings:**
   - **Plan**: Free
   - **Health Check Path**: `/api/health`

4. **Environment Variables** (clique em "Add Environment Variable"):

   ```
   DATABASE_URL = [Cole a Internal Database URL do Passo 1]
   JWT_SECRET = [Gere um secret: pode usar https://randomkeygen.com/]
   NODE_ENV = production
   PORT = 10000
   FRONTEND_URL = [Deixe vazio por enquanto, vamos preencher depois]
   CORS_ALLOW_ALL = false
   ```

5. Clique em **"Create Web Service"**
6. Aguarde o deploy (5-10 minutos)
7. **COPIE A URL DO BACKEND**: `https://nexuspm-backend.onrender.com`

### Passo 3: Testar o Backend

Abra no navegador:
```
https://seu-backend.onrender.com/api/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

---

## 🎨 PARTE 2: Deploy do Frontend (Vercel)

### Passo 1: Preparar o Projeto

No seu terminal local:

```bash
# Criar arquivo .env.production
echo VITE_API_URL=https://seu-backend.onrender.com > .env.production

# Commit e push
git add .
git commit -m "Configure production environment"
git push
```

### Passo 2: Deploy na Vercel

1. Acesse https://vercel.com/dashboard
2. Clique em **"Add New..."** → **"Project"**
3. Importe seu repositório GitHub
4. Configure:

   **Project Settings:**
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

   **Environment Variables:**
   ```
   VITE_API_URL = https://seu-backend.onrender.com
   ```

5. Clique em **"Deploy"**
6. Aguarde o deploy (2-3 minutos)
7. **COPIE A URL DO FRONTEND**: `https://seu-app.vercel.app`

---

## 🔗 PARTE 3: Conectar Frontend e Backend

### Atualizar CORS no Backend

1. Volte ao Render Dashboard
2. Acesse seu **nexuspm-backend**
3. Vá em **"Environment"**
4. Edite a variável **FRONTEND_URL**:
   ```
   FRONTEND_URL = https://seu-app.vercel.app
   ```
5. Clique em **"Save Changes"**
6. O Render vai fazer redeploy automático

### Testar a Conexão

1. Abra `https://seu-app.vercel.app`
2. Tente fazer login
3. Verifique o console do navegador (F12)

---

## ✅ Checklist Final

- [ ] Backend respondendo em `/api/health`
- [ ] Database conectado (sem erros de Prisma)
- [ ] Frontend carregando
- [ ] Login funcionando
- [ ] CORS configurado corretamente
- [ ] Variáveis de ambiente configuradas

---

## 🐛 Troubleshooting

### Erro: "CORS blocked"
**Solução**: Verifique se `FRONTEND_URL` no Render está correto (com https://)

### Erro: "Failed to fetch"
**Solução**: Verifique se `VITE_API_URL` na Vercel está correto

### Erro: "Database connection failed"
**Solução**: 
1. Verifique se `DATABASE_URL` está correto
2. Use a **Internal Database URL** (não a External)
3. Certifique-se que termina com `?schema=public`

### Backend demora para responder (primeira requisição)
**Normal**: Render Free tier hiberna após 15 minutos de inatividade. Primeira requisição demora ~30 segundos.

---

## 📊 Monitoramento

### Logs do Backend (Render)
```
https://dashboard.render.com → Seu Service → Logs
```

### Logs do Frontend (Vercel)
```
https://vercel.com/dashboard → Seu Projeto → Deployments → View Function Logs
```

---

## 🔄 Atualizações Futuras

### Atualizar Backend
```bash
git add .
git commit -m "Update backend"
git push
```
Render faz deploy automático.

### Atualizar Frontend
```bash
git add .
git commit -m "Update frontend"
git push
```
Vercel faz deploy automático.

---

## 💰 Custos

- **Render Free**: 750 horas/mês (suficiente para 1 serviço 24/7)
- **Vercel Free**: 100GB bandwidth/mês
- **PostgreSQL Free**: 1GB storage

**Total: R$ 0,00/mês** ✨

---

## 🎓 Próximos Passos

1. [ ] Configurar domínio customizado
2. [ ] Adicionar CI/CD com GitHub Actions
3. [ ] Configurar monitoramento (Sentry, LogRocket)
4. [ ] Implementar backup do database
5. [ ] Adicionar rate limiting

---

## 📞 Suporte

Se encontrar problemas:
1. Verifique os logs no Render e Vercel
2. Teste as URLs individualmente
3. Verifique as variáveis de ambiente
4. Consulte a documentação oficial

**Documentação:**
- Render: https://render.com/docs
- Vercel: https://vercel.com/docs
- Prisma: https://www.prisma.io/docs
