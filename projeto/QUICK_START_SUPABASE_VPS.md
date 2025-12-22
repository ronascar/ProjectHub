# 🚀 Guia Rápido - Supabase VPS

## Passo 1: Encontrar Credenciais na VPS

### Opção A: Script Automático

```bash
# Na VPS, execute:
bash scripts/find-supabase-credentials.sh
```

### Opção B: Manual

```bash
# Conectar na VPS
ssh usuario@seu-servidor.com

# Encontrar arquivo .env do Supabase
find / -name ".env" -path "*/supabase/*" 2>/dev/null

# Ver credenciais
cat /caminho/para/supabase/.env | grep -E "ANON_KEY|API_EXTERNAL_URL"
```

### Opção C: Via Coolify

1. Acesse Coolify Dashboard
2. Vá no serviço Supabase
3. Clique em **Environment Variables**
4. Copie `ANON_KEY` e `API_EXTERNAL_URL`

## Passo 2: Configurar .env Local

Crie/edite o arquivo `.env` na raiz do projeto:

```env
# Database (já configurado)
DATABASE_URL="postgresql://..."

# API Backend
VITE_API_URL=http://localhost:3001/api

# Supabase Storage (VPS)
VITE_SUPABASE_URL=https://supabase.seu-dominio.com
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Importante:**
- `VITE_SUPABASE_URL` = URL do Kong Gateway (porta 8000 ou seu domínio)
- `VITE_SUPABASE_ANON_KEY` = Chave pública (ANON_KEY)

## Passo 3: Instalar Dependência

```bash
npm install @supabase/supabase-js
```

## Passo 4: Criar Bucket

### Via Supabase Studio (Recomendado)

1. Acesse: `https://supabase.seu-dominio.com` (ou `http://IP:3000`)
2. Login: `supabase` / sua-senha
3. Storage → Create bucket
4. Nome: `avatars`
5. ✅ Public bucket
6. Create

### Via SQL

```sql
-- Conectar no PostgreSQL
docker exec -it supabase-db psql -U postgres -d postgres

-- Criar bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);
```

## Passo 5: Configurar Políticas RLS

No Supabase Studio → SQL Editor, execute:

```sql
-- Permitir upload
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Permitir leitura pública
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Permitir atualização
CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars');

-- Permitir exclusão
CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars');
```

## Passo 6: Testar

```bash
# Reiniciar dev server
npm run dev

# Acessar: http://localhost:5173/teams/create
# Tentar fazer upload de uma imagem
```

## Passo 7: Deploy (Coolify)

1. Acesse projeto no Coolify
2. Environment Variables → Add:
   ```
   VITE_SUPABASE_URL=https://supabase.seu-dominio.com
   VITE_SUPABASE_ANON_KEY=sua-chave-aqui
   ```
3. Redeploy

## Verificação Rápida

### ✅ Checklist

- [ ] Supabase rodando na VPS
- [ ] Credenciais copiadas (URL + ANON_KEY)
- [ ] Variáveis no `.env`
- [ ] Dependência instalada (`@supabase/supabase-js`)
- [ ] Bucket `avatars` criado
- [ ] Políticas RLS configuradas
- [ ] Dev server reiniciado
- [ ] Upload testado

### 🔍 Troubleshooting

**Erro: "Supabase not configured"**
```bash
# Verificar se variáveis estão no .env
cat .env | grep SUPABASE

# Reiniciar dev server
npm run dev
```

**Erro: "Bucket not found"**
```bash
# Verificar buckets
docker exec -it supabase-db psql -U postgres -d postgres \
  -c "SELECT * FROM storage.buckets;"
```

**Erro: "Failed to fetch"**
```bash
# Testar conexão
curl https://supabase.seu-dominio.com/storage/v1/bucket

# Verificar se Kong está rodando
docker ps | grep kong
```

**Erro: "CORS"**
```bash
# Adicionar no .env do Supabase na VPS
CORS_ALLOWED_ORIGINS=https://seu-frontend.com,http://localhost:5173

# Reiniciar
docker-compose restart
```

## URLs Importantes

- **Supabase Studio**: `https://supabase.seu-dominio.com` ou `http://IP:3000`
- **API Gateway (Kong)**: `https://supabase.seu-dominio.com` ou `http://IP:8000`
- **Storage API**: `https://supabase.seu-dominio.com/storage/v1`
- **Arquivos públicos**: `https://supabase.seu-dominio.com/storage/v1/object/public/avatars/`

## Comandos Úteis

```bash
# Ver containers
docker ps | grep supabase

# Ver logs do Storage
docker logs -f supabase-storage

# Ver logs do Kong
docker logs -f supabase-kong

# Reiniciar Storage
docker restart supabase-storage

# Listar buckets
docker exec -it supabase-db psql -U postgres -d postgres \
  -c "SELECT * FROM storage.buckets;"

# Listar arquivos no bucket
docker exec -it supabase-db psql -U postgres -d postgres \
  -c "SELECT * FROM storage.objects WHERE bucket_id = 'avatars';"
```

## Exemplo de .env Completo

```env
# ==================== DATABASE ====================
DATABASE_URL="postgresql://postgres:senha@supabase-db:5432/postgres"

# ==================== SERVER ====================
PORT=3001
NODE_ENV=production
JWT_SECRET=nexuspm-secret-key-2024

# ==================== FRONTEND ====================
VITE_API_URL=http://localhost:3001/api

# ==================== SUPABASE STORAGE (VPS) ====================
VITE_SUPABASE_URL=https://supabase.exemplo.com
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTc2OTIwMCwiZXhwIjoxOTU3MzQ1MjAwfQ.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE

# ==================== CORS ====================
FRONTEND_URL=https://seu-dominio.com
```

## Próximos Passos

Depois de configurar:

1. ✅ Testar upload local
2. ✅ Configurar variáveis no Coolify
3. ✅ Fazer deploy
4. ✅ Testar upload em produção

Precisa de ajuda? Verifique os logs:
```bash
# No navegador (F12)
Console → Procure por mensagens do Supabase

# Na VPS
docker logs supabase-storage
docker logs supabase-kong
```
