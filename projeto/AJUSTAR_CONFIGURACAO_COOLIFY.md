# 🔧 Ajustar Configuração do NexusPM no Coolify

## ⚠️ Problemas Identificados

Vejo nas configurações:
```
Port: 3000 ❌ (Errado - NexusPM usa 3001)
Domain: hub.otimizacut.com.br ✅ (Correto)
```

---

## 🎯 PASSO 1: Ajustar a Porta

### 1.1 No Coolify, vá em:
```
Sua Application → General → Port
```

### 1.2 Mude de `3000` para `3001`
```
Port: 3001
```

### 1.3 Clique em **Save**

---

## 🎯 PASSO 2: Configurar Environment Variables

### 2.1 Vá em:
```
Sua Application → Environment Variables
```

### 2.2 Adicione estas variáveis:

#### DATABASE_URL
```
Name: DATABASE_URL
Value: postgresql://postgres:hrTi10y3L3ibPFZqfszX1w8mUuIBq08Z@10.0.2.6:5432/postgres?schema=public
```

#### JWT_SECRET
Primeiro, gere um secret. No terminal da VPS:
```bash
openssl rand -base64 32
```

Copie o resultado e adicione:
```
Name: JWT_SECRET
Value: [cole o secret gerado]
```

#### NODE_ENV
```
Name: NODE_ENV
Value: production
```

#### PORT
```
Name: PORT
Value: 3001
```

#### FRONTEND_URL
```
Name: FRONTEND_URL
Value: https://hub.otimizacut.com.br
```

#### CORS_ALLOW_ALL
```
Name: CORS_ALLOW_ALL
Value: false
```

#### VITE_API_URL (para o build do frontend)
```
Name: VITE_API_URL
Value: https://hub.otimizacut.com.br/api
```

---

## 🎯 PASSO 3: Configurar Build Commands

### 3.1 Vá em:
```
Sua Application → Build → Build Pack
```

### 3.2 Configure:
```
Build Pack: Nixpacks (ou Node.js)
Install Command: npm install
Build Command: npx prisma generate && npm run build
Start Command: node server/index.cjs
```

---

## 🎯 PASSO 4: Configurar DNS

No seu provedor de domínio (Registro.br, Hostinger, etc):

### Adicionar registro A:
```
Tipo: A
Nome: hub
Valor: [IP da sua VPS]
TTL: 3600
```

Ou se já tem um domínio principal:
```
Tipo: CNAME
Nome: hub
Valor: otimizacut.com.br
TTL: 3600
```

---

## 🎯 PASSO 5: Fazer Deploy

### 5.1 Clique em **Deploy**

### 5.2 Aguarde o processo (5-10 minutos)

### 5.3 Acompanhe os logs

---

## 🎯 PASSO 6: Configurar Prisma (Após Deploy)

### 6.1 Acessar Terminal do Container

No Coolify:
```
Sua Application → Terminal
```

### 6.2 Executar comandos:
```bash
# Criar tabelas
npx prisma db push

# Popular com dados iniciais
npm run db:seed
```

---

## 🎯 PASSO 7: Testar

### 7.1 Abrir no navegador:
```
https://hub.otimizacut.com.br
```

### 7.2 Fazer login:
```
Email: admin@nexuspm.com
Senha: password123
```

### 7.3 Testar API:
```bash
curl https://hub.otimizacut.com.br/api/health
```

---

## 📋 Checklist Rápido

- [ ] Porta mudada para 3001
- [ ] 7 variáveis de ambiente adicionadas
- [ ] Build commands configurados
- [ ] DNS configurado (hub.otimizacut.com.br)
- [ ] Deploy iniciado
- [ ] `npx prisma db push` executado
- [ ] `npm run db:seed` executado
- [ ] Login funcionando

---

## 🐛 Troubleshooting

### Erro: "Cannot connect to database"
**Solução:** Verifique se `DATABASE_URL` está correto

### Erro: "Port already in use"
**Solução:** Mude a porta para 3001

### Erro: "CORS blocked"
**Solução:** Verifique se `FRONTEND_URL` está correto (com https://)

### Site não carrega
**Solução:** 
1. Verifique se DNS propagou: `nslookup hub.otimizacut.com.br`
2. Verifique logs no Coolify

---

## 🎯 Onde Você Está Agora?

Me diga em qual passo você está:
1. Ainda configurando o repositório?
2. Já criou a application?
3. Precisa ajustar as configurações?
4. Pronto para fazer deploy?

**Me avise e vou te ajudar no próximo passo!** 🚀
