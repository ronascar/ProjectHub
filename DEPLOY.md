# 🚀 DEPLOY NA VERCEL - GUIA DEFINITIVO

## ⚠️ IMPORTANTE: Estrutura do Projeto

Este projeto tem os arquivos na pasta `app/`, então a configuração é diferente!

```
stitch_dashboard_projecthub/
├── app/                    ← CÓDIGO AQUI
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json
└── README.md
```

---

## 🎯 CONFIGURAÇÃO CORRETA NA VERCEL

### **Passo 1: Importe o Projeto**

1. Acesse [vercel.com](https://vercel.com)
2. Clique em "Add New Project"
3. Importe seu repositório

### **Passo 2: Configure EXATAMENTE assim**

```
Framework Preset: Vite
Root Directory: app          ← IMPORTANTE!
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Node.js Version: 18.x
```

**ATENÇÃO:** O campo **Root Directory** DEVE ser `app`!

### **Passo 3: Deploy**

Clique em "Deploy" e aguarde.

---

## 🔧 SE DER ERRO, FAÇA ISSO:

### **Erro 1: "No Output Directory named 'dist' found"**

**Solução:**
1. Vá em Settings > General
2. Root Directory: `app`
3. Build Settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Salve e faça Redeploy

### **Erro 2: "Cannot find package.json"**

**Solução:**
- Certifique-se que Root Directory = `app`
- Não deixe em branco!

### **Erro 3: Rotas 404**

**Solução:**
- O arquivo `app/vercel.json` já está configurado
- Se não funcionar, adicione manualmente:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

## ✅ CHECKLIST PRÉ-DEPLOY

- [ ] Root Directory configurado como `app`
- [ ] Build local funciona: `cd app && npm run build`
- [ ] Arquivo `app/vercel.json` existe
- [ ] `package.json` está em `app/`

---

## 🎬 PASSO A PASSO VISUAL

### **1. Configuração Inicial**

![image](https://user-images.githubusercontent.com/placeholder/vercel-config.png)

**Configure assim:**
```
Project Name: stitch-dashboard-projecthub
Framework: Vite
Root Directory: app  ← CRUCIAL!
```

### **2. Build Settings**

```
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### **3. Environment Variables (Opcional)**

```
NODE_VERSION=18
```

---

## 🧪 TESTAR LOCALMENTE ANTES

```bash
# Entre na pasta app
cd app

# Instale dependências
npm install

# Build
npm run build

# Preview (simula produção)
npm run preview

# Acesse http://localhost:4173
# Teste TODAS as rotas!
```

---

## 📊 VERIFICAÇÃO PÓS-DEPLOY

Após o deploy, teste:

1. ✅ Página inicial: `https://seu-projeto.vercel.app`
2. ✅ Rota direta: `https://seu-projeto.vercel.app/projects`
3. ✅ Refresh na rota: F5 em `/projects` (não deve dar 404)
4. ✅ Dark mode funciona
5. ✅ Navegação funciona
6. ✅ Kanban funciona

---

## 🆘 AINDA COM ERRO?

### **Opção 1: Redeploy Limpo**

1. Settings > General
2. Scroll até embaixo
3. "Delete Project"
4. Importe novamente
5. Configure Root Directory = `app`

### **Opção 2: Deploy via CLI**

```bash
# Instale Vercel CLI
npm i -g vercel

# Entre na pasta app
cd app

# Deploy
vercel

# Produção
vercel --prod
```

### **Opção 3: Verificar Logs**

1. Acesse o deploy na Vercel
2. Clique em "View Build Logs"
3. Procure por erros em vermelho
4. Copie o erro e me envie

---

## 💡 DICAS IMPORTANTES

1. **SEMPRE** configure Root Directory como `app`
2. **NÃO** deixe Root Directory em branco
3. **NÃO** coloque `app/` no Build Command (a Vercel já sabe)
4. **SIM** use `npm run build` (não `cd app && npm run build`)

---

## 🎉 CONFIGURAÇÃO FINAL CORRETA

```json
{
  "name": "stitch-dashboard-projecthub",
  "framework": "vite",
  "rootDirectory": "app",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install",
  "devCommand": "npm run dev"
}
```

---

## 📞 SUPORTE

Se ainda tiver problemas:

1. Tire um print da tela de configuração
2. Copie os logs de erro
3. Verifique se Root Directory = `app`
4. Tente deploy via CLI

**Boa sorte!** 🚀
