# ProjectHub - Sistema de Gerenciamento de Projetos

## 🚀 Deploy na Vercel

### Configuração Automática

1. **Conecte seu repositório à Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "Add New Project"
   - Importe seu repositório do GitHub

2. **Configurações do Projeto:**
   - **Framework Preset:** Vite
   - **Root Directory:** `app`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

3. **Deploy:**
   - Clique em "Deploy"
   - Aguarde o build finalizar

### Configuração Manual (se necessário)

Se o deploy automático não funcionar, configure manualmente:

```bash
# Build Settings
Framework Preset: Vite
Root Directory: app
Build Command: npm run build
Output Directory: dist
Install Command: npm install
```

### Variáveis de Ambiente (se necessário)

Adicione no painel da Vercel em "Settings > Environment Variables":

```
NODE_VERSION=18
```

### Troubleshooting

**Problema: Rotas não funcionam (404)**
- Solução: O arquivo `vercel.json` na raiz já está configurado com rewrites

**Problema: Build falha**
- Verifique se todas as dependências estão no `package.json`
- Certifique-se que o Node.js está na versão 18+

**Problema: Página em branco**
- Verifique o console do navegador para erros
- Certifique-se que o `base` no `vite.config.ts` está correto

## 🛠️ Desenvolvimento Local

```bash
cd app
npm install
npm run dev
```

## 📦 Build Local

```bash
cd app
npm run build
npm run preview
```

## 🌐 URL de Produção

Após o deploy, sua aplicação estará disponível em:
`https://seu-projeto.vercel.app`

## 📝 Notas

- O projeto usa Vite + React + TypeScript
- React Router está configurado para SPA
- Tailwind CSS para estilização
- DnD Kit para drag and drop no Kanban
