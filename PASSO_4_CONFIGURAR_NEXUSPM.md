# 🚀 PASSO 4: Configurar e Fazer Deploy do NexusPM

## ✅ Connection String Confirmada

```
postgresql://postgres:hrTi10y3L3ibPFZqfszX1w8mUuIBq08Z@10.0.2.6:5432/postgres?schema=public
```

---

## 🎯 OPÇÃO A: Deploy no Coolify (RECOMENDADO)

### Vantagens:
- ✅ Deploy automático no git push
- ✅ SSL automático
- ✅ Gerenciamento fácil
- ✅ Logs centralizados

### Passos:

#### 1. No Coolify Dashboard
1. Vá em **Resources** → **New Resource**
2. Escolha **Application**
3. Conecte seu repositório GitHub do NexusPM

#### 2. Configurar Build
```
Build Pack: Node.js
Build Command: npm install && npx prisma generate && npm run build
Start Command: node server/index.cjs
Port: 3001
```

#### 3. Environment Variables
Adicione estas variáveis:

```env
DATABASE_URL=postgresql://postgres:hrTi10y3L3ibPFZqfszX1w8mUuIBq08Z@10.0.2.6:5432/postgres?schema=public
JWT_SECRET=gere-um-secret-forte-aqui
NODE_ENV=production
PORT=3001
FRONTEND_URL=https://otimizacut.com.br
CORS_ALLOW_ALL=false
```

**Gerar JWT_SECRET:**
```bash
openssl rand -base64 32
```

#### 4. Configurar Domínio
1. Em **Domains**, adicione: `otimizacut.com.br`
2. Coolify configura SSL automaticamente

#### 5. Deploy!
Clique em **Deploy** e aguarde.

---

## 🎯 OPÇÃO B: Deploy Manual na VPS

### 1. Clonar Repositório
```bash
cd /var/www
git clone https://github.com/seu-usuario/seu-repo.git nexuspm
cd nexuspm
```

### 2. Instalar Dependências
```bash
npm install
```

### 3. Criar .env
```bash
nano .env
```

Cole:
```env
DATABASE_URL="postgresql://postgres:hrTi10y3L3ibPFZqfszX1w8mUuIBq08Z@10.0.2.6:5432/postgres?schema=public"
JWT_SECRET="cole-o-secret-gerado-aqui"
NODE_ENV="production"
PORT=3001
FRONTEND_URL="https://otimizacut.com.br"
CORS_ALLOW_ALL=false
```

Salve: `Ctrl+X`, `Y`, `Enter`

**Gerar JWT_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Configurar Prisma
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

### 5. Build Frontend
```bash
nano .env.production
```

Cole:
```env
VITE_API_URL=https://otimizacut.com.br/api
```

```bash
npm run build
```

### 6. Iniciar Backend com PM2
```bash
pm2 start server/index.cjs --name nexuspm-backend
pm2 save
pm2 logs nexuspm-backend
```

### 7. Configurar Nginx
```bash
nano /etc/nginx/sites-available/nexuspm
```

Cole:
```nginx
server {
    listen 80;
    server_name otimizacut.com.br www.otimizacut.com.br;

    # Frontend
    location / {
        root /var/www/nexuspm/dist;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/nexuspm /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 8. Configurar SSL
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d otimizacut.com.br -d www.otimizacut.com.br
```

Atualizar .env:
```bash
nano .env
# Mudar FRONTEND_URL para https://otimizacut.com.br
```

```bash
nano .env.production
# Mudar VITE_API_URL para https://otimizacut.com.br/api
```

```bash
npm run build
pm2 restart nexuspm-backend
```

---

## 🧪 Testar

### 1. Verificar Backend
```bash
curl http://localhost:3001/api/health
```

Deve retornar:
```json
{"status":"ok","timestamp":"..."}
```

### 2. Verificar no Navegador
1. Abra: https://otimizacut.com.br
2. Tente fazer login
3. Credenciais padrão (se rodou o seed):
   - Email: `admin@nexuspm.com`
   - Senha: `password123`

---

## 🐛 Troubleshooting

### Ver logs do backend
```bash
pm2 logs nexuspm-backend
```

### Ver tabelas criadas
```bash
psql "postgresql://postgres:hrTi10y3L3ibPFZqfszX1w8mUuIBq08Z@10.0.2.6:5432/postgres"
\dt
\q
```

### Recriar tabelas
```bash
cd /var/www/nexuspm
npx prisma db push --force-reset
npm run db:seed
```

---

## 📋 Qual Opção Você Prefere?

**Opção A (Coolify):** Mais fácil, deploy automático
**Opção B (Manual):** Mais controle, mas mais trabalho

Me diga qual você quer seguir! 🚀
