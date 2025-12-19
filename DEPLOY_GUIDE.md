# 🚀 Guia de Deploy - NexusPM

## 📋 Estrutura do Projeto

O projeto está organizado da seguinte forma:

```
stitch_dashboard_projecthub/
├── src/                    # Código-fonte da aplicação
│   ├── App.jsx            # Componente principal e roteamento
│   ├── main.tsx           # Ponto de entrada da aplicação
│   ├── style.css          # Estilos globais
│   ├── components/        # Componentes reutilizáveis
│   ├── context/           # Context API (Auth, Theme)
│   ├── layouts/           # Layouts da aplicação
│   └── pages/             # Páginas da aplicação
├── public/                # Arquivos estáticos
├── dist/                  # Build de produção (gerado)
├── index.html             # HTML principal
├── package.json           # Dependências do projeto
├── vite.config.ts         # Configuração do Vite
├── tailwind.config.js     # Configuração do Tailwind CSS
├── tsconfig.json          # Configuração do TypeScript
└── vercel.json            # Configuração do Vercel

```

## 🛠️ Tecnologias Utilizadas

- **React 19** - Framework UI
- **React Router DOM** - Roteamento
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Framework CSS
- **TypeScript** - Tipagem estática
- **@dnd-kit** - Drag and drop para Kanban

## 📦 Instalação Local

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview do build de produção
npm run preview
```

## 🌐 Deploy na Vercel

### Opção 1: Deploy via CLI

```bash
# Instalar Vercel CLI (se ainda não tiver)
npm i -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Deploy para produção
vercel --prod
```

### Opção 2: Deploy via GitHub

1. **Faça push do código para o GitHub:**
   ```bash
   git add .
   git commit -m "Preparado para deploy"
   git push origin main
   ```

2. **Conecte o repositório na Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "Add New Project"
   - Importe seu repositório do GitHub
   - Configure as seguintes opções:
     - **Framework Preset:** Vite
     - **Root Directory:** `./` (raiz do projeto)
     - **Build Command:** `npm run build`
     - **Output Directory:** `dist`
     - **Install Command:** `npm install`

3. **Deploy automático:**
   - Cada push para a branch `main` fará deploy automático

### Opção 3: Deploy Manual via Dashboard

1. Faça o build local:
   ```bash
   npm run build
   ```

2. Acesse o [dashboard da Vercel](https://vercel.com/dashboard)

3. Arraste e solte a pasta `dist` na área de upload

## ⚙️ Configurações Importantes

### vercel.json

O arquivo `vercel.json` está configurado para lidar com o roteamento do React Router:

```json
{
  "routes": [
    {
      "src": "/[^.]+",
      "dest": "/",
      "status": 200
    }
  ]
}
```

Isso garante que todas as rotas sejam redirecionadas para o `index.html`, permitindo que o React Router funcione corretamente.

### Variáveis de Ambiente

Se você precisar adicionar variáveis de ambiente:

1. Crie um arquivo `.env` na raiz do projeto:
   ```env
   VITE_API_URL=https://sua-api.com
   ```

2. No código, acesse via:
   ```javascript
   const apiUrl = import.meta.env.VITE_API_URL;
   ```

3. Na Vercel, adicione as variáveis em:
   - Settings → Environment Variables

## 🔍 Verificação Pós-Deploy

Após o deploy, verifique:

- ✅ A página inicial carrega corretamente
- ✅ O login funciona
- ✅ Todas as rotas estão acessíveis
- ✅ O tema escuro/claro funciona
- ✅ O Kanban board funciona com drag and drop
- ✅ Não há erros no console do navegador

## 🐛 Solução de Problemas

### Erro 404 nas rotas

Se você encontrar erro 404 ao acessar rotas diretamente:
- Verifique se o arquivo `vercel.json` está presente na raiz
- Confirme que a configuração de rotas está correta

### Build falha

Se o build falhar:
```bash
# Limpe o cache e reinstale
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Estilos não carregam

- Verifique se o Tailwind CSS está configurado corretamente
- Confirme que `style.css` está sendo importado no `main.tsx`

## 📝 Notas Adicionais

- **Pastas de Template:** As pastas com nomes em português (ex: `calendário/`, `configurações_do_sistema/`) contêm protótipos HTML e não são necessárias para o deploy. Elas estão listadas no `.gitignore`.

- **Performance:** O build atual gera um bundle de ~582 KB. Para melhorar, considere:
  - Code splitting com `React.lazy()` e `Suspense`
  - Lazy loading de rotas
  - Otimização de imagens

- **SEO:** Para melhorar o SEO, considere adicionar:
  - Meta tags em cada página
  - Server-side rendering (SSR) com Next.js ou similar
  - Sitemap.xml

## 🔗 Links Úteis

- [Documentação do Vite](https://vitejs.dev/)
- [Documentação do Vercel](https://vercel.com/docs)
- [React Router](https://reactrouter.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

**Desenvolvido com ❤️ usando React + Vite + Tailwind CSS**
