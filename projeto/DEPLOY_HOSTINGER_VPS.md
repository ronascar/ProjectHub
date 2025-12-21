# 🚀 Deploy NexusPM - Hostinger VPS

## Arquitetura
Tudo na sua VPS: Frontend + Backend + PostgreSQL

---

## PASSO 1: Preparar VPS (10 min)

### 1.1 Conectar via SSH
```bash
ssh root@seu-ip-vps
```

### 1.2 Atualizar sistema
```bash
apt update && apt upgrade -y
```

### 1.3 Instalar Node.js 20
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v  # Verificar versão
```

### 1.4 Instalar PostgreSQL
```bash
apt install -y postgresql postgresql-contrib
systemctl start postgresql
systemctl enable postgresql
```

### 1.5 Instalar PM2 (gerenciador de processos)
```bash
npm install -g pm2
```

### 1.6 Instalar Nginx (servidor web)
```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

---

## PASSO 2: Configurar PostgreSQL (5 min)

### 2.1 Criar database e usuário
```bash
sudo -u postgres psql
```

Dentro do PostgreSQL:
```sql
CREATE DATABASE nexuspm;
CREATE USER nexuspm_user WITH PASSWORD 'sua_senha_forte_aqui';
GRANT ALL PRIVILEGES ON DATABASE nexuspm TO nexuspm_user;
\q
```

### 2.2 Anotar connection string
```
postgresql://nexuspm_user:sua_senha_forte_aqui@localhost:5432/nexuspm?schema=public
```

---

## PASSO 3: Deploy do Backend (10 min)

### 3.1 Clonar repositório
```bash
cd /var/www
git clone https://github.com/seu-usuario/seu-repo.git nexuspm
cd nexuspm
```

### 3.2 Instalar dependências
```bash
npm install
```

### 3.3 Configurar variáveis de ambiente
```bash
nano .env
```

Cole:
```env
DATABASE_URL="postgresql://nexuspm_user:sua_senha_forte_aqui@localhost:5432/nexuspm?schema=public"
JWT_SECRET="seu-jwt-secret-super-seguro"
NODE_ENV="production"
PORT=3001
FRONTEND_URL="http://seu-dominio.com"
CORS_ALLOW_ALL=false
```

Salve: `Ctrl+X`, `Y`, `Enter`

### 3.4 Configurar Prisma
```bash
npx prisma generate
npx prisma db push
npm run db:seed  # Criar usuários iniciais
```

### 3.5 Iniciar backend com PM2
```bash
pm2 start server/index.cjs --name nexuspm-backend
pm2 save
pm2 startup  # Copie e execute o comando que aparecer
```

### 3.6 Verificar se está rodando
```bash
pm2 status
curl http://localhost:3001/api/health
```

---

## PASSO 4: Build do Frontend (5 min)

### 4.1 Criar .env.production
```bash
nano .env.production
```

Cole:
```env
VITE_API_URL=http://seu-dominio.com/api
```

Salve: `Ctrl+X`, `Y`, `Enter`

### 4.2 Build
```bash
npm run build
```

Isso cria a pasta `dist/` com os arquivos estáticos.

---

## PASSO 5: Configurar Nginx (10 min)

### 5.1 Criar configuração
```bash
nano /etc/nginx/sites-available/nexuspm
```

Cole:
```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    # Frontend (arquivos estáticos)
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

Salve: `Ctrl+X`, `Y`, `Enter`

### 5.2 Ativar site
```bash
ln -s /etc/nginx/sites-available/nexuspm /etc/nginx/sites-enabled/
nginx -t  # Testar configuração
systemctl reload nginx
```

---

## PASSO 6: Configurar SSL (Opcional, 5 min)

### 6.1 Instalar Certbot
```bash
apt install -y certbot python3-certbot-nginx
```

### 6.2 Obter certificado SSL
```bash
certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

Siga as instruções. O Certbot vai configurar SSL automaticamente.

### 6.3 Atualizar .env para HTTPS
```bash
nano .env
```

Mude:
```env
FRONTEND_URL="https://seu-dominio.com"
```

```bash
nano .env.production
```

Mude:
```env
VITE_API_URL=https://seu-dominio.com/api
```

### 6.4 Rebuild frontend e restart backend
```bash
npm run build
pm2 restart nexuspm-backend
```

---

## PASSO 7: Testar

1. Abra `http://seu-dominio.com` (ou https se configurou SSL)
2. Faça login
3. Teste as funcionalidades

---

## 🔧 Comandos Úteis

### Ver logs do backend
```bash
pm2 logs nexuspm-backend
```

### Restart backend
```bash
pm2 restart nexuspm-backend
```

### Ver status
```bash
pm2 status
```

### Atualizar código
```bash
cd /var/www/nexuspm
git pull
npm install
npm run build
npx prisma generate
npx prisma db push
pm2 restart nexuspm-backend
```

### Ver logs do Nginx
```bash
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log
```

### Backup do database
```bash
pg_dump -U nexuspm_user nexuspm > backup_$(date +%Y%m%d).sql
```

### Restaurar backup
```bash
psql -U nexuspm_user nexuspm < backup_20241220.sql
```

---

## 🐛 Problemas Comuns

### Backend não inicia
```bash
pm2 logs nexuspm-backend  # Ver erro
```

### Erro de conexão com database
```bash
# Verificar se PostgreSQL está rodando
systemctl status postgresql

# Testar conexão
psql -U nexuspm_user -d nexuspm -h localhost
```

### Nginx não carrega
```bash
nginx -t  # Testar configuração
systemctl status nginx
```

### Porta 80/443 bloqueada
```bash
# Abrir portas no firewall
ufw allow 80
ufw allow 443
ufw allow 22  # SSH
ufw enable
```

---

## 🔒 Segurança (Recomendado)

### 1. Firewall
```bash
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

### 2. Fail2ban (proteção contra brute force)
```bash
apt install -y fail2ban
systemctl enable fail2ban
systemctl start fail2ban
```

### 3. Atualizar senha do PostgreSQL
```bash
sudo -u postgres psql
ALTER USER nexuspm_user WITH PASSWORD 'nova_senha_super_forte';
\q
```

Atualizar no `.env`

### 4. Desabilitar login root via SSH
```bash
nano /etc/ssh/sshd_config
```

Mude:
```
PermitRootLogin no
```

Crie um usuário normal antes!

---

## 📊 Monitoramento

### PM2 Monitoring
```bash
pm2 monit  # Monitor em tempo real
```

### Logs automáticos
```bash
pm2 install pm2-logrotate  # Rotacionar logs automaticamente
```

---

**Pronto! Seu app está rodando na VPS! 🎉**

**Vantagens:**
- ✅ Controle total
- ✅ Sem limitações de tempo
- ✅ Tudo em um lugar
- ✅ Sem dependência de serviços externos
