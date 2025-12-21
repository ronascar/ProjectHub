# ⚡ COMANDOS RÁPIDOS - NexusPM

## 🚀 SETUP INICIAL

```bash
# Copiar variáveis de ambiente
copy .env.example .env

# Instalar dependências
npm install

# Gerar Prisma Client
npm run db:generate

# Criar tabelas no banco
npm run db:push

# Popular banco com dados de teste
npm run db:seed
```

---

## 🧪 TESTES

```bash
# Testar conexão com banco de dados
npm run test:connection

# Testar antes do deploy (conexão + build)
npm run deploy:check

# Abrir Prisma Studio (visualizar banco)
npm run db:studio
```

---

## 💻 DESENVOLVIMENTO LOCAL

```bash
# Iniciar apenas o frontend
npm run dev

# Iniciar apenas o backend
npm run dev:server

# Iniciar frontend + backend simultaneamente
npm run dev:all
```

**URLs Locais:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3001
- API Health: http://localhost:3001/api/health

---

## 🏗️ BUILD

```bash
# Build do frontend
npm run build

# Preview do build
npm run preview
```

---

## 🗄️ BANCO DE DADOS

```bash
# Gerar Prisma Client
npm run db:generate

# Aplicar schema no banco (sem migrations)
npm run db:push

# Popular banco com dados de teste
npm run db:seed

# Abrir Prisma Studio
npm run db:studio

# Resetar banco (CUIDADO: apaga tudo!)
npx prisma db push --force-reset
```

---

## 🚀 DEPLOY

### **Backend (Render.com):**

```bash
# Via Render Dashboard:
# 1. New + → Web Service
# 2. Connect GitHub repo
# 3. Configure:
#    Build: npm install && npx prisma generate && npx prisma db push
#    Start: node server/index.cjs
# 4. Add environment variables
# 5. Deploy

# Via Render Shell (após deploy):
npm run db:seed
```

### **Frontend (Vercel):**

```bash
# Via Vercel Dashboard:
# 1. Add New → Project
# 2. Import GitHub repo
# 3. Framework: Vite
# 4. Add env var: VITE_API_URL
# 5. Deploy

# Via CLI:
npm i -g vercel
vercel login
vercel
vercel --prod
```

---

## 🔍 DIAGNÓSTICO

### **Testar Backend Local:**
```bash
# Health check
curl http://localhost:3001/api/health

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@nexuspm.com\",\"password\":\"password123\"}"
```

### **Testar Backend em Produção:**
```bash
# Health check
curl https://seu-backend.onrender.com/api/health

# Login
curl -X POST https://seu-backend.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@nexuspm.com\",\"password\":\"password123\"}"
```

### **Verificar Logs:**
```bash
# Render: Dashboard → Logs
# Vercel: Deployments → [Deploy] → Building
# Browser: F12 → Console
```

---

## 🔧 MANUTENÇÃO

### **Atualizar Dependências:**
```bash
# Verificar atualizações
npm outdated

# Atualizar todas
npm update

# Atualizar específica
npm install package@latest
```

### **Limpar Cache:**
```bash
# Limpar node_modules
rmdir /s /q node_modules
del package-lock.json

# Reinstalar
npm install

# Limpar build
rmdir /s /q dist

# Rebuild
npm run build
```

### **Resetar Prisma:**
```bash
# Deletar Prisma Client
rmdir /s /q node_modules\.prisma
rmdir /s /q node_modules\@prisma\client

# Regenerar
npm run db:generate
```

---

## 🐛 TROUBLESHOOTING

### **Erro: "Cannot find module '@prisma/client'"**
```bash
npm run db:generate
```

### **Erro: "Port 3001 already in use"**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID [PID] /F

# Ou mude a porta no .env
PORT=3002
```

### **Erro: "CORS blocked"**
```bash
# Adicione a URL do frontend no server/index.cjs
# Ou temporariamente:
CORS_ALLOW_ALL=true
```

### **Erro: "Database connection failed"**
```bash
# Verifique .env
# Teste conexão
npm run test:connection
```

### **Erro: "Invalid credentials"**
```bash
# Popular banco
npm run db:seed

# Ou criar usuário manualmente
npm run db:studio
```

---

## 📊 MONITORAMENTO

### **Render.com:**
```bash
# Logs em tempo real
# Dashboard → Logs

# Métricas
# Dashboard → Metrics

# Shell
# Dashboard → Shell
```

### **Vercel:**
```bash
# Logs de build
# Deployments → [Deploy] → Building

# Logs de runtime
# Deployments → [Deploy] → Functions

# Analytics
# Dashboard → Analytics
```

---

## 🔐 SEGURANÇA

### **Gerar JWT Secret:**
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### **Hash de Senha (bcrypt):**
```bash
node -e "console.log(require('bcryptjs').hashSync('password123', 12))"
```

---

## 📦 BACKUP

### **Exportar Banco:**
```bash
# PostgreSQL
pg_dump -h 192.46.217.197 -U c1hub -d c1hub > backup.sql

# Ou via Prisma Studio
npm run db:studio
# Export → SQL
```

### **Importar Banco:**
```bash
# PostgreSQL
psql -h 192.46.217.197 -U c1hub -d c1hub < backup.sql
```

---

## 🎯 ATALHOS ÚTEIS

### **Desenvolvimento:**
```bash
# Tudo de uma vez
npm install && npm run db:generate && npm run db:push && npm run db:seed && npm run dev:all
```

### **Deploy Check:**
```bash
# Verificar tudo antes do deploy
npm run test:connection && npm run build && echo "✅ Pronto para deploy!"
```

### **Reset Completo:**
```bash
# CUIDADO: Apaga tudo!
rmdir /s /q node_modules dist
del package-lock.json
npm install
npm run db:generate
npx prisma db push --force-reset
npm run db:seed
```

---

## 📝 CREDENCIAIS DE TESTE

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

Visualizador:
Email: viewer@nexuspm.com
Senha: password123
```

---

## 🔗 LINKS ÚTEIS

- **Render Dashboard:** https://dashboard.render.com
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Prisma Docs:** https://www.prisma.io/docs
- **Vite Docs:** https://vitejs.dev
- **React Router:** https://reactrouter.com

---

## 💡 DICAS

1. **Sempre teste localmente antes do deploy**
   ```bash
   npm run deploy:check
   ```

2. **Use Prisma Studio para visualizar dados**
   ```bash
   npm run db:studio
   ```

3. **Monitore os logs em produção**
   - Render: Dashboard → Logs
   - Vercel: Deployments → Logs

4. **Mantenha .env atualizado**
   ```bash
   # Nunca commite o .env!
   # Use .env.example como template
   ```

5. **Faça backup do banco regularmente**
   ```bash
   pg_dump ... > backup-$(date +%Y%m%d).sql
   ```

---

**Comandos compilados por Kiro AI Assistant** 🤖
