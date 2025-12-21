# ✅ Checklist Deploy Coolify - ProjectHub

## 📋 Passo a Passo para Resolver o Erro DEPLOYMENT_NOT_FOUND

### 1. Configurar Variáveis de Ambiente no Coolify

Acesse o painel do Coolify → Seu Projeto → Environment Variables e adicione:

```env
DATABASE_URL=postgresql://postgres:hrTi10y3L3ibPFZqfszX1w8mUuIBq08Z@supabase-db-bgcwg4k8ckk0skss4w0kgcso:5432/postgres?schema=public
PORT=3001
NODE_ENV=production
JWT_SECRET=nexuspm-secret-key-2024-secure-token
FRONTEND_URL=https://seu-dominio.coolify.app
CORS_ALLOW_ALL=false
```

**⚠️ IMPORTANTE:** Substitua `seu-dominio.coolify.app` pelo domínio real do seu deploy!

### 2. Verificar Configurações do Projeto

- **Build Command**: Já configurado no `nixpacks.toml`
- **Start Command**: `node server/index.cjs` (já configurado)
- **Port**: 3001
- **Health Check Path**: `/api/health`

### 3. Fazer o Deploy

1. Certifique-se que o código está no GitHub (✅ já está!)
2. No Coolify, clique em **"Redeploy"** ou **"Deploy"**
3. Acompanhe os logs de build

### 4. Verificar Logs

Durante o deploy, verifique:

**Build Logs - Deve mostrar:**
```
✓ npm install
✓ npx prisma generate
✓ npm run build
✓ dist/ folder created
```

**Runtime Logs - Deve mostrar:**
```
🚀 Server running on http://localhost:3001
📊 API endpoints available at http://localhost:3001/api
```

### 5. Testar a Aplicação

Após o deploy bem-sucedido:

1. Acesse: `https://seu-dominio.coolify.app`
2. Deve aparecer a tela de login
3. Teste o health check: `https://seu-dominio.coolify.app/api/health`

### 6. Atualizar FRONTEND_URL

Depois que o domínio estiver funcionando:

1. Volte nas Environment Variables
2. Atualize `FRONTEND_URL` com o domínio correto
3. Faça **Redeploy**

## 🐛 Troubleshooting

### Erro: Build Failed

**Verifique:**
- Logs de build no Coolify
- Se todas as dependências foram instaladas
- Se o TypeScript compilou sem erros

**Solução:**
```bash
# Teste localmente
npm install
npm run build
```

### Erro: Server Not Starting

**Verifique:**
- Runtime logs no Coolify
- Se a variável `DATABASE_URL` está correta
- Se o Prisma Client foi gerado

**Solução:**
- Confirme que `DATABASE_URL` está nas variáveis de ambiente
- O build deve executar `npx prisma generate`

### Erro: Can't Connect to Database

**Verifique:**
- Se o Supabase está rodando no Coolify
- Se o hostname do banco está correto
- Se estão na mesma rede Docker

**Solução:**
- O hostname `supabase-db-bgcwg4k8ckk0skss4w0kgcso` deve ser o nome do serviço Supabase no Coolify
- Verifique no painel do Coolify qual é o nome correto do serviço

### Erro: CORS

**Sintoma:** Frontend carrega mas API não responde

**Solução:**
1. Atualize `FRONTEND_URL` com o domínio correto
2. Ou temporariamente use `CORS_ALLOW_ALL=true` (apenas para debug!)
3. Faça redeploy

## 📊 Status Esperado

Quando tudo estiver funcionando:

- ✅ Build concluído sem erros
- ✅ Servidor iniciado na porta 3001
- ✅ Health check respondendo
- ✅ Tela de login carregando
- ✅ API respondendo às requisições

## 🚀 Próximos Passos Após Deploy

1. Criar usuário admin (se necessário):
   ```bash
   # No terminal do Coolify
   npm run db:seed
   ```

2. Configurar domínio customizado (opcional)

3. Configurar SSL/HTTPS (Coolify faz automaticamente)

4. Monitorar logs e performance

## 📞 Suporte

Se o erro persistir, verifique:
1. Logs completos de build e runtime no Coolify
2. Se o Supabase está acessível
3. Se todas as variáveis de ambiente estão corretas
4. Se o código foi atualizado no GitHub
