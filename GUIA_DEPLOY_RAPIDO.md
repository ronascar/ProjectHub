# 🚀 GUIA DE DEPLOY RÁPIDO - NexusPM

## ⚡ DEPLOY EM 15 MINUTOS

### 📋 PRÉ-REQUISITOS
- [ ] Conta no GitHub
- [ ] Conta no Render.com (gratuita)
- [ ] Conta na Vercel (gratuita)
- [ ] Banco PostgreSQL acessível

---

## PASSO 1: PREPARAR O CÓDIGO

### 1.1 Atualizar variáveis de ambiente

Copie o arquivo de exemplo:
```bash
copy .env.example .env
```

Edite `.env` com suas credenciais reais:
```env
DATABASE_URL="postgresql://c1hub:3KJqihmqLV_H9@192.46.217.197:5432/c1hub?schema=public"
JWT_SECRET=nexuspm-secret-key-2024-secure-token
NODE_ENV=development
VITE_API_URL=http://localhost:3001/api
```

### 1.2 Testar localmente

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npm run db:generate

# Criar tabelas no banco
npm run db:push

# Popular banco com dados de teste
npm run db:seed

# Testar backend
npm run dev:server

# Em outro terminal, testar frontend
npm run dev
```

Acesse `http://localhost:5173` e teste o login:
- Email: `admin@nexuspm.com`
- Senha: `password123`

Se funcionar localmente, prossiga para o deploy!

---

## PASSO 2: DEPLOY DO BACKEND (RENDER.COM)

### 2.1 Criar conta no Render

1. Acesse [render.com](https://render.com)
2. Clique em "Get Started for Free"
3. Faça login com GitHub

### 2.2 Criar Web Service

1. No dashboard, clique em "New +" → "Web Service"
2. Conecte seu repositório GitHub
3. Selecione o repositório do projeto
4. Configure:

```
Name: nexuspm-backend
Region: Oregon (US West)
Branch: main
Root Directory: (deixe vazio)
Environment: Node
Build Command: npm install && npx prisma generate && npx prisma db push
Start Command: node server/index.cjs
```

### 2.3 Adicionar variáveis de ambiente

Na seção "Environment Variables", adicione:

```
DATABASE_URL = postgresql://c1hub:3KJqihmqLV_H9@192.46.217.197:5432/c1hub?schema=public
JWT_SECRET = nexuspm-secret-key-2024-secure-token
NODE_ENV = production
PORT = 3001
FRONTEND_URL = https://seu-projeto.vercel.app
CORS_ALLOW_ALL = false
```

**IMPORTANTE:** Você vai atualizar `FRONTEND_URL` depois!

### 2.4 Criar o serviço

1. Clique em "Create Web Service"
2. Aguarde o deploy (5-10 minutos)
3. Quando terminar, copie a URL gerada
   - Exemplo: `https://nexuspm-backend.onrender.com`

### 2.5 Testar o backend

Abra no navegador:
```
https://nexuspm-backend.onrender.com/api/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"2025-12-20T..."}
```

✅ Backend funcionando!

---

## PASSO 3: DEPLOY DO FRONTEND (VERCEL)

### 3.1 Criar conta na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Sign Up"
3. Faça login com GitHub

### 3.2 Importar projeto

1. No dashboard, clique em "Add New..." → "Project"
2. Selecione seu repositório
3. Configure:

```
Framework Preset: Vite
Root Directory: ./
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 3.3 Adicionar variável de ambiente

Na seção "Environment Variables", adicione:

```
Name: VITE_API_URL
Value: https://nexuspm-backend.onrender.com/api
```

**IMPORTANTE:** Use a URL do seu backend Render (do Passo 2.4)!

### 3.4 Deploy

1. Clique em "Deploy"
2. Aguarde o build (2-3 minutos)
3. Quando terminar, copie a URL gerada
   - Exemplo: `https://nexuspm.vercel.app`

✅ Frontend funcionando!

---

## PASSO 4: ATUALIZAR CORS NO BACKEND

### 4.1 Voltar ao Render.com

1. Acesse seu Web Service no Render
2. Vá em "Environment"
3. Edite a variável `FRONTEND_URL`
4. Cole a URL do seu frontend Vercel
   - Exemplo: `https://nexuspm.vercel.app`
5. Clique em "Save Changes"

O backend vai fazer redeploy automaticamente (1-2 minutos).

---

## PASSO 5: POPULAR O BANCO DE DADOS

### 5.1 Executar seed via Render Shell

1. No Render, vá em "Shell" (menu lateral)
2. Execute:

```bash
npm run db:seed
```

Isso vai criar:
- ✅ Usuário admin
- ✅ Projetos de exemplo
- ✅ Tarefas de exemplo
- ✅ Clientes de exemplo

---

## PASSO 6: TESTAR O SISTEMA

### 6.1 Acessar o frontend

Abra a URL do seu projeto Vercel:
```
https://nexuspm.vercel.app
```

### 6.2 Fazer login

Use as credenciais de teste:
```
Email: admin@nexuspm.com
Senha: password123
```

### 6.3 Verificar funcionalidades

- [ ] Login funciona
- [ ] Dashboard carrega
- [ ] Lista de projetos aparece
- [ ] Kanban board funciona
- [ ] Criação de tarefas funciona
- [ ] Sem erros no console (F12)

---

## ✅ DEPLOY CONCLUÍDO!

Seu sistema está no ar! 🎉

### 📝 URLs Importantes

- **Frontend:** `https://seu-projeto.vercel.app`
- **Backend:** `https://nexuspm-backend.onrender.com`
- **API Health:** `https://nexuspm-backend.onrender.com/api/health`

### 🔐 Credenciais de Acesso

```
Admin:
Email: admin@nexuspm.com
Senha: password123

Gerente:
Email: manager@nexuspm.com
Senha: password123

Desenvolvedor:
Email: dev@nexuspm.com
Senha: password123
```

---

## 🐛 PROBLEMAS COMUNS

### Erro: "Network Error" ao fazer login

**Causa:** Frontend não consegue conectar ao backend

**Solução:**
1. Verifique se o backend está rodando: `https://seu-backend.onrender.com/api/health`
2. Verifique se `VITE_API_URL` está correta na Vercel
3. Faça um redeploy na Vercel

### Erro: "CORS policy blocked"

**Causa:** Backend não permite requisições do frontend

**Solução:**
1. Verifique se `FRONTEND_URL` está correta no Render
2. Certifique-se de que a URL não tem barra no final
3. Faça um redeploy no Render

### Backend muito lento (primeira requisição)

**Causa:** Render free tier desliga o servidor após 15 minutos de inatividade

**Solução:**
- É normal! A primeira requisição demora ~30 segundos
- Considere upgrade para plano pago ($7/mês) se precisar de performance

### Erro: "Invalid credentials"

**Causa:** Banco de dados não tem usuários

**Solução:**
1. Execute o seed: `npm run db:seed` no Render Shell
2. Ou crie um usuário manualmente via Prisma Studio

---

## 🔄 ATUALIZAÇÕES FUTURAS

Quando fizer alterações no código:

### Atualizar Backend:
1. Faça commit e push para o GitHub
2. Render faz deploy automático
3. Aguarde 2-3 minutos

### Atualizar Frontend:
1. Faça commit e push para o GitHub
2. Vercel faz deploy automático
3. Aguarde 1-2 minutos

---

## 📊 MONITORAMENTO

### Render.com:
- Logs em tempo real: Dashboard → Logs
- Métricas: Dashboard → Metrics
- Shell: Dashboard → Shell

### Vercel:
- Logs de build: Deployments → [Deploy] → Building
- Logs de runtime: Deployments → [Deploy] → Functions
- Analytics: Dashboard → Analytics

---

## 💰 CUSTOS

### Plano Gratuito:
- **Render:** 750 horas/mês (suficiente para 1 serviço 24/7)
- **Vercel:** Ilimitado para projetos pessoais
- **Total:** R$ 0,00/mês

### Limitações do Plano Gratuito:
- ⚠️ Backend desliga após 15 min de inatividade (cold start)
- ⚠️ 512 MB RAM no backend
- ⚠️ 100 GB bandwidth/mês na Vercel

### Upgrade Recomendado (Opcional):
- **Render Starter:** $7/mês (sem cold start, 512 MB RAM)
- **Vercel Pro:** $20/mês (mais recursos e analytics)

---

## 🆘 SUPORTE

Se tiver problemas:

1. Verifique os logs no Render e Vercel
2. Teste o backend diretamente: `curl https://seu-backend.onrender.com/api/health`
3. Verifique o console do navegador (F12)
4. Consulte o arquivo `ANALISE_PROBLEMAS_DEPLOY.md`

---

**Boa sorte com seu deploy!** 🚀
