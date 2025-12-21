# Deploy no Coolify - ProjectHub

## ⚠️ Problema Atual: DEPLOYMENT_NOT_FOUND

Este erro ocorre quando o Coolify não consegue encontrar ou iniciar o deployment. Siga os passos abaixo:

## 🔒 Importante: Banco de Dados Interno do Coolify

O Supabase está rodando **dentro da rede interna do Coolify**. Isso significa:
- ✅ A aplicação **consegue conectar** quando rodando no Coolify
- ❌ **Não é possível testar localmente** com essa connection string
- 🔐 O hostname `supabase-db-bgcwg4k8ckk0skss4w0kgcso` só funciona dentro da rede Docker do Coolify

Para desenvolvimento local, você precisaria de uma connection string diferente ou usar um banco local.

## 🔧 Configuração no Coolify

### 1. Variáveis de Ambiente Obrigatórias

Configure estas variáveis no painel do Coolify:

```env
# Database (Supabase via Coolify)
DATABASE_URL=postgresql://postgres:hrTi10y3L3ibPFZqfszX1w8mUuIBq08Z@supabase-db-bgcwg4k8ckk0skss4w0kgcso:5432/postgres?schema=public

# Server
PORT=3001
NODE_ENV=production
JWT_SECRET=nexuspm-secret-key-2024-secure-token

# CORS - Adicione o domínio do seu Coolify
FRONTEND_URL=https://seu-dominio.coolify.app
CORS_ALLOW_ALL=false
```

### 2. Configurações do Build

O arquivo `nixpacks.toml` já está configurado corretamente:
- ✅ Node.js 20
- ✅ Prisma generate
- ✅ Build do frontend
- ✅ Start do servidor

### 3. Porta e Health Check

- **Porta**: 3001 (ou a que você configurou no PORT)
- **Health Check**: `/api/health`
- **Start Command**: `node server/index.cjs` (já configurado no nixpacks.toml)

### 4. Domínio

Após o deploy bem-sucedido:
1. Configure o domínio no Coolify
2. Atualize a variável `FRONTEND_URL` com o domínio correto
3. Faça redeploy

## 🐛 Troubleshooting

### Erro: DEPLOYMENT_NOT_FOUND

**Causas possíveis:**
1. Build falhou - verifique os logs de build no Coolify
2. Servidor não iniciou - verifique os logs de runtime
3. Porta incorreta - certifique-se que a PORT está correta
4. Variáveis de ambiente faltando - principalmente DATABASE_URL

**Soluções:**
1. Verifique os logs no Coolify (Build Logs e Runtime Logs)
2. Confirme que todas as variáveis de ambiente estão configuradas
3. Teste a conexão com o banco de dados
4. Verifique se a pasta `dist/` foi gerada no build

### Verificar Build Local

Antes de fazer deploy, teste localmente:

```bash
# Instalar dependências
npm install

# Gerar Prisma Client
npx prisma generate

# Build
npm run build

# Verificar se a pasta dist foi criada
ls dist/

# Testar servidor
node server/index.cjs
```

### Logs Importantes

No Coolify, verifique:
1. **Build Logs**: Erros durante `npm install` ou `npm run build`
2. **Runtime Logs**: Erros ao iniciar o servidor
3. **Database Connection**: Erros de conexão com PostgreSQL

## 📝 Checklist de Deploy

- [ ] Variáveis de ambiente configuradas no Coolify
- [ ] DATABASE_URL correto e acessível
- [ ] Build concluído com sucesso (pasta dist/ criada)
- [ ] Servidor iniciando na porta correta
- [ ] Health check respondendo em `/api/health`
- [ ] Domínio configurado
- [ ] FRONTEND_URL atualizado com o domínio do Coolify

## 🚀 Próximos Passos

1. Acesse o painel do Coolify
2. Vá em "Environment Variables" e configure todas as variáveis
3. Clique em "Redeploy"
4. Acompanhe os logs de build e runtime
5. Teste o endpoint `/api/health`
6. Acesse a aplicação pelo domínio configurado
