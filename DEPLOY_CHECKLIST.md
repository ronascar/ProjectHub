# ✅ Checklist de Deploy - ProjectHub

## 📋 Pré-Deploy

### Estrutura do Projeto
- [x] Todos os arquivos movidos da pasta `app/` para a raiz
- [x] Pasta `src/` contém todos os componentes, páginas e contextos
- [x] Arquivo `index.html` na raiz do projeto
- [x] Configurações (`package.json`, `vite.config.ts`, `tailwind.config.js`) na raiz
- [x] Pasta `public/` para arquivos estáticos

### Configurações
- [x] `package.json` configurado corretamente
- [x] `tsconfig.json` com suporte a JSX e React
- [x] `vite.config.ts` configurado
- [x] `tailwind.config.js` configurado
- [x] `vercel.json` com rotas para SPA
- [x] `.gitignore` atualizado

### Dependências
- [x] React 19.2 instalado
- [x] React Router DOM 7.11 instalado
- [x] Tailwind CSS 3.4 instalado
- [x] @dnd-kit instalado
- [x] @types/react e @types/react-dom instalados

### Build
- [x] `npm install` executado com sucesso
- [x] `npm run build` executado com sucesso
- [x] Pasta `dist/` gerada corretamente
- [x] Sem erros de TypeScript
- [x] Sem erros de compilação

## 🚀 Deploy na Vercel

### Opção 1: Via GitHub (Recomendado)

1. **Preparar o Repositório**
   ```bash
   git add .
   git commit -m "Preparado para deploy - estrutura reorganizada"
   git push origin main
   ```

2. **Conectar na Vercel**
   - Acesse: https://vercel.com/new
   - Importe o repositório: `ronascar/ProjectHub`
   - Configure:
     - Framework Preset: **Vite**
     - Root Directory: **`./`** (raiz)
     - Build Command: **`npm run build`**
     - Output Directory: **`dist`**
     - Install Command: **`npm install`**

3. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build completar
   - Acesse a URL gerada

### Opção 2: Via CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (preview)
vercel

# Deploy (produção)
vercel --prod
```

### Opção 3: Deploy Manual

```bash
# Build local
npm run build

# Arraste a pasta dist/ para vercel.com/new
```

## ✅ Verificações Pós-Deploy

### Funcionalidades Básicas
- [ ] Página inicial carrega sem erros
- [ ] Login funciona (admin@example.com / admin123)
- [ ] Dashboard exibe corretamente
- [ ] Navegação entre páginas funciona

### Rotas
- [ ] `/` - Dashboard
- [ ] `/login` - Página de Login
- [ ] `/projects` - Lista de Projetos
- [ ] `/projects/create` - Criar Projeto
- [ ] `/kanban` - Kanban Board
- [ ] `/tasks` - Minhas Tarefas
- [ ] `/calendar` - Calendário
- [ ] `/teams` - Equipe
- [ ] `/reports` - Relatórios
- [ ] `/settings` - Configurações
- [ ] `/inbox` - Inbox

### Funcionalidades Avançadas
- [ ] Drag and drop no Kanban funciona
- [ ] Tema claro/escuro alterna corretamente
- [ ] Sidebar expande/colapsa
- [ ] Formulários salvam dados
- [ ] Rotas protegidas redirecionam para login

### Performance
- [ ] Página carrega em menos de 3 segundos
- [ ] Sem erros no console do navegador
- [ ] Sem warnings críticos
- [ ] Imagens carregam corretamente

### Responsividade
- [ ] Mobile (< 768px) - Layout adaptado
- [ ] Tablet (768px - 1024px) - Layout adaptado
- [ ] Desktop (> 1024px) - Layout completo

## 🐛 Troubleshooting

### Erro 404 nas rotas
**Problema:** Ao acessar uma rota diretamente (ex: `/projects`), retorna 404.

**Solução:** Verificar se o arquivo `vercel.json` existe e contém:
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

### Build falha
**Problema:** `npm run build` falha com erros de TypeScript.

**Solução:**
```bash
# Limpar cache
rm -rf node_modules package-lock.json dist
npm install
npm run build
```

### Estilos não carregam
**Problema:** Página carrega sem estilos.

**Solução:**
- Verificar se `style.css` está importado no `main.tsx`
- Verificar se Tailwind está configurado corretamente
- Verificar se PostCSS está instalado

### Erro de módulo não encontrado
**Problema:** Erro "Cannot find module 'react'" ou similar.

**Solução:**
```bash
npm install @types/react @types/react-dom
```

## 📊 Métricas de Sucesso

- ✅ Build time: < 5 minutos
- ✅ Bundle size: < 1 MB (gzipped)
- ✅ Lighthouse Score: > 90
- ✅ First Contentful Paint: < 1.5s
- ✅ Time to Interactive: < 3s

## 🔗 Links Importantes

- **Repositório:** https://github.com/ronascar/ProjectHub
- **Vercel Dashboard:** https://vercel.com/dashboard
- **Documentação Vite:** https://vitejs.dev/
- **Documentação Vercel:** https://vercel.com/docs

## 📝 Notas Finais

### Pastas de Template
As seguintes pastas contêm apenas protótipos HTML e **não são necessárias** para o deploy:
- `calendário/`
- `configurações_do_sistema/`
- `criação/`
- `dashboard_(gerente_de_projetos)/`
- `detalhes_do_projeto/`
- `equipe/`
- `exportações_e_relatórios/`
- `gestão_de_tarefas_(kanban)/`
- `lista_de_projetos/`
- `membros/`
- `minhas_tarefas/`
- `página_de_login/`
- `team/`
- `versionamento_e_histórico_1/`
- `versionamento_e_histórico_2/`
- `visualização_de_tarefas_(timeline/`
- `Criação_e_edição_de_tarefas/`
- `Imbox/`

Essas pastas estão listadas no `.gitignore` e não serão enviadas para o repositório.

### Próximos Passos (Pós-Deploy)

1. **Configurar Domínio Customizado** (opcional)
   - Vercel → Settings → Domains
   - Adicionar domínio personalizado

2. **Configurar Analytics** (opcional)
   - Vercel → Analytics
   - Habilitar Web Analytics

3. **Configurar Variáveis de Ambiente** (se necessário)
   - Vercel → Settings → Environment Variables
   - Adicionar variáveis necessárias

4. **Configurar CI/CD**
   - Deploy automático a cada push na branch `main`
   - Preview deployments para pull requests

---

**Status:** ✅ Pronto para Deploy!

Última atualização: 2025-12-19
