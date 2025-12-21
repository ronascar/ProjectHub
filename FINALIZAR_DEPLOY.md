# 🎯 Finalizar Deploy do NexusPM

## 🔑 PASSO 1: Gerar JWT_SECRET

### No terminal da VPS, execute:
```bash
openssl rand -base64 32
```

Vai gerar algo como:
```
Kx7mP9nQ2wR5tY8uI1oP3aS6dF4gH7jK9lZ0xC2vB5nM8qW1eR4tY7uI0oP3aS6d
```

**Copie esse valor!**

---

## 🔧 PASSO 2: Adicionar JWT_SECRET no Coolify

1. No Coolify, vá em: **Sua Application → Environment Variables**
2. Clique em **+ Add**
3. Preencha:
   ```
   Name: JWT_SECRET
   Value: [Cole o secret gerado acima]
   ```
4. Clique em **Save**

---

## 🔧 PASSO 3: Verificar Todas as Variáveis

Certifique-se que tem estas 7 variáveis:

```
✅ DATABASE_URL = postgresql://postgres:hrTi10y3L3ibPFZqfszX1w8mUuIBq08Z@10.0.2.6:5432/postgres?schema=public
✅ JWT_SECRET = [O que você acabou de gerar]
✅ NODE_ENV = production
✅ PORT = 3001
✅ FRONTEND_URL = https://hub.otimizacut.com.br
✅ CORS_ALLOW_ALL = false
✅ VITE_API_URL = https://hub.otimizacut.com.br/api
```

---

## 🔄 PASSO 4: Redeploy

1. No Coolify, clique em **Redeploy**
2. Aguarde o processo (5-10 minutos)
3. Acompanhe os logs

---

## 🗄️ PASSO 5: Configurar Database (IMPORTANTE!)

### 5.1 Acessar Terminal do Container

No Coolify:
```
Sua Application → Terminal (ou Execute Command)
```

### 5.2 Criar Tabelas
```bash
npx prisma db push
```

Aguarde até aparecer:
```
✔ Generated Prisma Client
✔ Database synchronized
```

### 5.3 Popular com Dados Iniciais
```bash
npm run db:seed
```

Deve aparecer:
```
✔ Seed data created successfully
```

Isso cria:
- Usuário admin: `admin@nexuspm.com` / `password123`
- Dados de exemplo

---

## 🧪 PASSO 6: Testar

### 6.1 Testar API
```bash
curl https://hub.otimizacut.com.br/api/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"2024-12-21T..."}
```

### 6.2 Testar no Navegador

1. Abra: **https://hub.otimizacut.com.br**
2. Deve carregar a página de login
3. Faça login:
   - **Email:** `admin@nexuspm.com`
   - **Senha:** `password123`
4. Deve redirecionar para o dashboard

---

## 🐛 Se Não Funcionar

### Erro 502 Bad Gateway
**Causa:** Backend não iniciou
**Solução:**
```bash
# Ver logs no Coolify
Sua Application → Logs

# Procure por erros
```

### Erro de Database
**Causa:** Prisma não criou as tabelas
**Solução:**
```bash
# No terminal do container
npx prisma db push --force-reset
npm run db:seed
```

### Erro de CORS
**Causa:** `FRONTEND_URL` incorreto
**Solução:**
```bash
# Verificar se está exatamente assim:
FRONTEND_URL=https://hub.otimizacut.com.br
# (sem barra no final!)
```

### Página em branco
**Causa:** Frontend não buildou corretamente
**Solução:**
```bash
# Verificar se VITE_API_URL está correto
VITE_API_URL=https://hub.otimizacut.com.br/api
```

---

## 📋 Checklist Final

- [ ] JWT_SECRET gerado e adicionado
- [ ] Todas as 7 variáveis configuradas
- [ ] Redeploy feito
- [ ] `npx prisma db push` executado
- [ ] `npm run db:seed` executado
- [ ] API respondendo em `/api/health`
- [ ] Login funcionando
- [ ] Dashboard carregando

---

## 🎉 Pronto!

Se tudo funcionou, seu NexusPM está no ar em:
**https://hub.otimizacut.com.br**

---

## 🔄 Próximos Passos (Opcional)

### 1. Mudar Senha do Admin
```bash
# No terminal do container
npx prisma studio
# Acesse via túnel SSH se necessário
```

### 2. Configurar Auto Deploy
```
Coolify → Sua App → Settings → Auto Deploy
✅ Enable Auto Deploy
```

Agora todo push no GitHub faz deploy automático!

### 3. Monitorar
```
Coolify → Sua App → Logs (ver logs em tempo real)
Coolify → Sua App → Metrics (ver uso de recursos)
```

---

## 🆘 Me Avise

**Execute o comando para gerar o JWT_SECRET e me diga:**
1. O secret gerado (pode ocultar parte dele)
2. Se conseguiu adicionar no Coolify
3. Se o redeploy funcionou
4. Se conseguiu executar os comandos do Prisma

Vou te ajudar a finalizar! 🚀
