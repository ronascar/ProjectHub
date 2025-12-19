# ⚡ DEPLOY RÁPIDO - VERCEL

## 🎯 CONFIGURAÇÃO EM 3 PASSOS

### 1️⃣ IMPORTE O PROJETO
- Acesse vercel.com
- "Add New Project"
- Selecione o repositório

### 2️⃣ CONFIGURE (COPIE E COLE)

```
Framework Preset: Vite
Root Directory: app
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### 3️⃣ DEPLOY
- Clique em "Deploy"
- Aguarde 2-3 minutos
- Pronto! ✅

---

## ⚠️ ATENÇÃO

**Root Directory DEVE ser `app`**

❌ ERRADO: deixar em branco
❌ ERRADO: colocar `./app`
✅ CERTO: `app`

---

## 🔥 COMANDOS RÁPIDOS (CLI)

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
cd app
vercel --prod
```

---

## 📋 CHECKLIST

- [ ] Root Directory = `app`
- [ ] Build Command = `npm run build`
- [ ] Output Directory = `dist`
- [ ] Deploy ✅

---

**Dúvidas?** Leia o DEPLOY.md completo
