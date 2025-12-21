# Configuração do Supabase Self-Hosted (VPS) para Upload de Avatares

## 1. Verificar Instalação do Supabase na VPS

Primeiro, verifique se o Supabase está rodando corretamente na sua VPS:

```bash
# Conectar na VPS via SSH
ssh usuario@seu-servidor.com

# Verificar containers do Supabase
docker ps | grep supabase

# Você deve ver containers como:
# - supabase-db (PostgreSQL)
# - supabase-kong (API Gateway)
# - supabase-auth (GoTrue)
# - supabase-rest (PostgREST)
# - supabase-storage (Storage API)
# - supabase-realtime
```

## 2. Obter Credenciais do Supabase Self-Hosted

### Opção A: Via Docker Compose

Se você instalou via Docker Compose, as credenciais estão no arquivo `.env` ou `docker-compose.yml`:

```bash
# Na pasta do Supabase na VPS
cd /caminho/para/supabase
cat .env | grep -E "ANON_KEY|SERVICE_ROLE_KEY|API_EXTERNAL_URL"
```

Procure por:
- `ANON_KEY` ou `SUPABASE_ANON_KEY` - Chave pública anônima
- `SERVICE_ROLE_KEY` - Chave de serviço (não use no frontend!)
- `API_EXTERNAL_URL` ou `PUBLIC_REST_URL` - URL da API

### Opção B: Via Coolify

Se instalou via Coolify:

1. Acesse o Coolify Dashboard
2. Vá no serviço do Supabase
3. Clique em **Environment Variables**
4. Procure por:
   - `ANON_KEY`
   - `API_EXTERNAL_URL` ou `PUBLIC_REST_URL`

### Opção C: Gerar Novas Chaves JWT

Se não encontrar as chaves, você pode gerar novas:

```bash
# Instalar ferramenta para gerar JWT
npm install -g @supabase/cli

# Ou usar um gerador online:
# https://supabase.com/docs/guides/self-hosting/docker#generate-api-keys
```

## 3. Identificar a URL do Supabase

A URL do seu Supabase self-hosted geralmente é:

```
https://seu-dominio.com
# ou
https://supabase.seu-dominio.com
# ou
http://ip-da-vps:8000
```

**Importante:** A URL deve apontar para o Kong Gateway (porta 8000 por padrão).

## 4. Configurar Variáveis de Ambiente

### No arquivo `.env` do seu projeto:

```env
# ==================== SUPABASE STORAGE (VPS) ====================
# URL do Supabase na sua VPS (Kong Gateway)
VITE_SUPABASE_URL=https://supabase.seu-dominio.com
# ou se não tiver domínio:
# VITE_SUPABASE_URL=http://ip-da-vps:8000

# Chave anônima (ANON_KEY) do Supabase
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

### Exemplo Real:

```env
VITE_SUPABASE_URL=https://supabase.exemplo.com
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTY0MTc2OTIwMCwiZXhwIjoxOTU3MzQ1MjAwfQ.dc_X5iR_VP_qT0zsiyj_I_OZ2T9FtRU2BBNWN8Bu4GE
```

## 5. Criar Bucket no Supabase Self-Hosted

### Via Supabase Studio (Interface Web)

1. Acesse o Supabase Studio: `https://supabase.seu-dominio.com` ou `http://ip-da-vps:3000`
2. Faça login (credenciais padrão: `supabase` / senha definida no `.env`)
3. Vá em **Storage** no menu lateral
4. Clique em **Create a new bucket**
5. Configure:
   - **Name**: `avatars`
   - **Public bucket**: ✅ Marque como público
   - Clique em **Create bucket**

### Via SQL (Alternativa)

Se não tiver acesso ao Studio, execute via SQL:

```sql
-- Conectar no PostgreSQL
psql -h localhost -U postgres -d postgres

-- Criar bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true);
```

## 6. Configurar Políticas RLS

Execute no SQL Editor do Supabase Studio ou via `psql`:

```sql
-- Política 1: Upload (INSERT)
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');

-- Política 2: Leitura Pública (SELECT)
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- Política 3: Atualização (UPDATE)
CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars');

-- Política 4: Exclusão (DELETE)
CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars');
```

## 7. Verificar Configuração do Storage

### Verificar se o Storage está rodando:

```bash
# Na VPS
docker ps | grep storage

# Verificar logs
docker logs supabase-storage
```

### Testar acesso à API do Storage:

```bash
# Substituir pela sua URL
curl https://supabase.seu-dominio.com/storage/v1/bucket

# Deve retornar lista de buckets (pode estar vazia)
```

## 8. Configurar CORS (se necessário)

Se tiver problemas de CORS, adicione no `.env` do Supabase:

```env
# No arquivo .env do Supabase na VPS
ADDITIONAL_REDIRECT_URLS=https://seu-frontend.com
CORS_ALLOWED_ORIGINS=https://seu-frontend.com,http://localhost:5173
```

Depois reinicie os containers:

```bash
docker-compose down
docker-compose up -d
```

## 9. Testar Upload

### Teste via cURL:

```bash
# Substituir valores
SUPABASE_URL="https://supabase.seu-dominio.com"
ANON_KEY="sua-chave-anonima"

# Upload de teste
curl -X POST "$SUPABASE_URL/storage/v1/object/avatars/test.txt" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: text/plain" \
  --data "Hello World"

# Verificar se foi criado
curl "$SUPABASE_URL/storage/v1/object/public/avatars/test.txt"
```

## 10. Configuração no Coolify (Produção)

Se estiver usando Coolify para deploy:

1. Acesse o projeto no Coolify
2. Vá em **Environment Variables**
3. Adicione:
   ```
   VITE_SUPABASE_URL=https://supabase.seu-dominio.com
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
   ```
4. Faça redeploy do projeto

## 11. Estrutura de URLs

Com Supabase self-hosted, as URLs seguem este padrão:

```
# API Base
https://supabase.seu-dominio.com

# Storage API
https://supabase.seu-dominio.com/storage/v1

# URL pública de arquivos
https://supabase.seu-dominio.com/storage/v1/object/public/avatars/arquivo.jpg
```

## 12. Troubleshooting

### Erro: "Failed to fetch"
- Verifique se o Supabase está acessível: `curl https://supabase.seu-dominio.com`
- Verifique firewall da VPS (porta 8000 ou 443)
- Verifique se o Kong está rodando: `docker ps | grep kong`

### Erro: "Invalid API key"
- Verifique se a `ANON_KEY` está correta
- Verifique se não há espaços extras na chave
- Gere uma nova chave se necessário

### Erro: "Bucket not found"
- Verifique se o bucket `avatars` foi criado
- Execute: `SELECT * FROM storage.buckets;` no PostgreSQL

### Erro: "Row-level security policy violation"
- Verifique se as políticas RLS foram criadas
- Execute as queries SQL da seção 6 novamente

### CORS Error
- Adicione seu domínio em `CORS_ALLOWED_ORIGINS`
- Reinicie os containers do Supabase

## 13. Comandos Úteis

```bash
# Ver logs do Storage
docker logs -f supabase-storage

# Ver logs do Kong (API Gateway)
docker logs -f supabase-kong

# Reiniciar apenas o Storage
docker restart supabase-storage

# Verificar buckets no banco
docker exec -it supabase-db psql -U postgres -d postgres -c "SELECT * FROM storage.buckets;"

# Verificar objetos no bucket
docker exec -it supabase-db psql -U postgres -d postgres -c "SELECT * FROM storage.objects WHERE bucket_id = 'avatars';"
```

## 14. Backup e Segurança

### Backup dos arquivos:

```bash
# Os arquivos ficam em:
/var/lib/docker/volumes/supabase_storage/_data

# Fazer backup
tar -czf storage-backup.tar.gz /var/lib/docker/volumes/supabase_storage/_data
```

### Segurança:

- ✅ Use HTTPS (configure SSL/TLS)
- ✅ Mantenha a `SERVICE_ROLE_KEY` secreta (nunca no frontend)
- ✅ Use apenas `ANON_KEY` no frontend
- ✅ Configure políticas RLS adequadas
- ✅ Limite tamanho de upload no Kong

## 15. Alternativa: MinIO

Se tiver problemas com o Supabase Storage, você pode usar MinIO:

```bash
# Instalar MinIO na VPS
docker run -d \
  -p 9000:9000 \
  -p 9001:9001 \
  --name minio \
  -v /mnt/data:/data \
  -e "MINIO_ROOT_USER=admin" \
  -e "MINIO_ROOT_PASSWORD=senha123" \
  quay.io/minio/minio server /data --console-address ":9001"
```

Mas recomendo usar o Supabase Storage que já está configurado na sua VPS.

## Resumo Rápido

1. ✅ Obter `ANON_KEY` do `.env` do Supabase na VPS
2. ✅ Obter URL do Supabase (Kong Gateway)
3. ✅ Adicionar variáveis no `.env` do projeto
4. ✅ Criar bucket `avatars` via Studio ou SQL
5. ✅ Configurar políticas RLS
6. ✅ Testar upload
7. ✅ Deploy com variáveis configuradas

Precisa de ajuda para encontrar as credenciais na sua VPS? Me avise!
