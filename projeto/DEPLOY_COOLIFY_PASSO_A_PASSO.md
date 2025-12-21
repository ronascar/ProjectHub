# 🚀 Deploy NexusPM no Coolify - Passo a Passo

## ✅ Informações que Você Precisa

```
DATABASE_URL: postgresql://postgres:hrTi10y3L3ibPFZqfszX1w8mUuIBq08Z@10.0.2.6:5432/postgres?schema=public
Domínio: otimizacut.com.br
Repositório: GitHub (seu repositório do NexusPM)
```

---

## 📋 PASSO 1: Preparar o Repositório

### 1.1 Criar arquivo de configuração do Coolify (opcional)

No seu repositório, crie o arquivo `nixpacks.toml` na raiz:

```toml
[phases.setup]
nixPkgs = ['nodejs_20']

[phases.install]
cmds = ['npm install']

[phases.build]
cmds = ['npx prisma generate', 'npm run build']

[start]
cmd = 'node server/index.cjs'
```

### 1.2 Commit e push
```bash
git add .
git commit -m "Add Coolify configuration"
git push
```

---

## 📋 PASSO 2: Criar Application no Coolify

### 2.1 Acessar Coolify
1. Acesse seu Coolify Dashboard
2. Clique em **Resources** (menu lateral)
3. Clique em **+ New Resource**

### 2.2 Escolher Tipo
1. Selecione **Application**
2. Clique em **Next**

### 2.3 Conectar GitHub
1. Escolha **GitHub**
2. Se ainda não conectou, autorize o Coolify no GitHub
3. Selecione o repositório do NexusPM
4. Escolha a branch: `main` (ou `master`)

### 2.4 Configurar Básico
```
Name: nexuspm
Server: Seu servidor (provavelmente só tem 1)
Destination: Seu destino (provavelmente só tem 1)
```

Clique em **Continue**

---

## 📋 PASSO 3: Configurar Build

### 3.1 Build Settings
```
Build Pack: Nixpacks (ou Node.js)
Install Command: npm install
Build Command: npx prisma generate && npm run build
Start Command: node server/index.cjs
Port: 3001
```

### 3.2 Health Check (opcional)
```
Health Check Path: /api/health
Health Check Port: 3001
```

---

## 📋 PASSO 4: Configurar Environment Variables

Clique em **Environment Variables** e adicione:

### 4.1 Database
```
Name: DATABASE_URL
Value: postgresql://postgres:hrTi10y3L3ibPFZqfszX1w8mUuIBq08Z@10.0.2.6:5432/postgres?schema=public
```

### 4.2 JWT Secret
Primeiro, gere um secret forte. No terminal da VPS:
```bash
openssl rand -base64 32
```

Copie o resultado e adicione:
```
Name: JWT_SECRET
Value: [cole o secret gerado]
```

### 4.3 Node Environment
```
Name: NODE_ENV
Value: production
```

### 4.4 Port
```
Name: PORT
Value: 3001
```

### 4.5 Frontend URL
```
Name: FRONTEND_URL
Value: https://otimizacut.com.br
```

### 4.6 CORS
```
Name: CORS_ALLOW_ALL
Value: false
```

### 4.7 Frontend API URL (para o build do frontend)
```
Name: VITE_API_URL
Value: https://otimizacut.com.br/api
```

---

## 📋 PASSO 5: Configurar Domínio

### 5.1 Adicionar Domínio
1. Vá em **Domains**
2. Clique em **+ Add Domain**
3. Digite: `otimizacut.com.br`
4. Clique em **Add**

### 5.2 Configurar DNS
No seu provedor de domínio (Registro.br, Hostinger, etc):

**Opção 1: Apontar para o IP da VPS**
```
Tipo: A
Nome: @
Valor: [IP da sua VPS]
TTL: 3600
```

**Opção 2: Apontar subdomínio**
```
Tipo: CNAME
Nome: app
Valor: seu-servidor.com
TTL: 3600
```

### 5.3 SSL
O Coolify vai gerar o certificado SSL automaticamente após o DNS propagar (pode levar até 48h, mas geralmente é rápido).

---

## 📋 PASSO 6: Deploy!

### 6.1 Iniciar Deploy
1. Clique em **Deploy**
2. Aguarde o processo (5-10 minutos)
3. Acompanhe os logs em tempo real

### 6.2 O que vai acontecer:
```
1. Clone do repositório
2. npm install
3. npx prisma generate
4. npm run build (frontend)
5. Criar container
6. Iniciar aplicação
7. Health check
8. ✅ Deploy concluído!
```

---

## 📋 PASSO 7: Configurar Prisma (Primeira Vez)

### 7.1 Acessar Terminal do Container
1. No Coolify, vá na aplicação NexusPM
2. Clique em **Terminal** ou **Execute Command**

### 7.2 Criar Tabelas
```bash
npx prisma db push
```

### 7.3 Popular com Dados Iniciais
```bash
npm run db:seed
```

Isso vai criar:
- Usuário admin: `admin@nexuspm.com` / `password123`
- Dados de exemplo

---

## 📋 PASSO 8: Testar

### 8.1 Verificar Logs
1. No Coolify, vá em **Logs**
2. Verifique se não há erros
3. Procure por: `🚀 Server running on http://localhost:3001`

### 8.2 Testar no Navegador
1. Abra: `https://otimizacut.com.br`
2. Deve carregar a página de login
3. Tente fazer login:
   - Email: `admin@nexuspm.com`
   - Senha: `password123`

### 8.3 Verificar API
```bash
curl https://otimizacut.com.br/api/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"..."}
```

---

## 🔧 Configurações Adicionais (Opcional)

### Auto Deploy
1. Em **Settings** → **Auto Deploy**
2. Ative **Enable Auto Deploy**
3. Agora, todo push no GitHub faz deploy automático!

### Restart Policy
```
Restart Policy: Always
Max Restarts: 10
```

### Resources (se precisar)
```
CPU Limit: 1
Memory Limit: 512MB
```

---

## 🐛 Troubleshooting

### Deploy falhou?
1. Veja os logs no Coolify
2. Verifique se todas as variáveis de ambiente estão corretas
3. Verifique se o `DATABASE_URL` está correto

### Erro de conexão com database?
```bash
# No terminal do container
npx prisma db push
```

### Frontend não carrega?
Verifique se `VITE_API_URL` está configurado corretamente.

### CORS Error?
Verifique se `FRONTEND_URL` está correto (com https://).

---

## 🔄 Atualizar Código

### Automático (se configurou Auto Deploy):
```bash
git add .
git commit -m "Update"
git push
```

Coolify faz deploy automático!

### Manual:
1. No Coolify, clique em **Redeploy**
2. Aguarde o processo

---

## 📊 Monitoramento

### Ver Logs em Tempo Real
```
Coolify → Sua App → Logs
```

### Ver Métricas
```
Coolify → Sua App → Metrics
```

### Restart Manual
```
Coolify → Sua App → Restart
```

---

## ✅ Checklist Final

- [ ] Repositório no GitHub
- [ ] Application criada no Coolify
- [ ] Environment Variables configuradas
- [ ] Domínio adicionado
- [ ] DNS configurado
- [ ] Deploy concluído
- [ ] `npx prisma db push` executado
- [ ] `npm run db:seed` executado
- [ ] Login funcionando
- [ ] API respondendo

---

## 🎉 Pronto!

Seu NexusPM está no ar em: **https://otimizacut.com.br**

**Vantagens do Coolify:**
- ✅ Deploy automático no git push
- ✅ SSL automático
- ✅ Logs centralizados
- ✅ Fácil de gerenciar
- ✅ Restart automático se cair

---

**Alguma dúvida? Me avise em qual passo você está!** 🚀
