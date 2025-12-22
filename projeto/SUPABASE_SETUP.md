# Configuração do Supabase Storage para Upload de Avatares

## 1. Instalar Dependência

```bash
npm install @supabase/supabase-js
```

## 2. Criar Bucket no Supabase

1. Acesse seu projeto no [Supabase Dashboard](https://app.supabase.com)
2. Vá em **Storage** no menu lateral
3. Clique em **Create a new bucket**
4. Configure:
   - **Name**: `avatars`
   - **Public bucket**: ✅ Marque como público
   - Clique em **Create bucket**

## 3. Configurar Políticas de Acesso (RLS)

No Supabase, vá em **Storage** > **Policies** e adicione as seguintes políticas para o bucket `avatars`:

### Política 1: Upload (INSERT)
```sql
CREATE POLICY "Authenticated users can upload avatars"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars');
```

### Política 2: Leitura Pública (SELECT)
```sql
CREATE POLICY "Public can view avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

### Política 3: Atualização (UPDATE)
```sql
CREATE POLICY "Users can update own avatars"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars');
```

### Política 4: Exclusão (DELETE)
```sql
CREATE POLICY "Users can delete own avatars"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'avatars');
```

## 4. Obter Credenciais do Supabase

1. No Supabase Dashboard, vá em **Settings** > **API**
2. Copie:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (chave pública anônima)

## 5. Configurar Variáveis de Ambiente

Adicione no seu arquivo `.env`:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

**⚠️ IMPORTANTE:** 
- Nunca commite o arquivo `.env` no Git
- Use `.env.example` como template
- Em produção (Coolify), adicione essas variáveis nas configurações do projeto

## 6. Testar Upload

Após configurar:

1. Reinicie o servidor de desenvolvimento
2. Acesse a página de criar/editar membro
3. Tente fazer upload de uma imagem de avatar
4. Verifique no Supabase Storage se o arquivo foi enviado

## 7. Verificar Configuração

O serviço de upload (`src/services/upload.js`) já está configurado e inclui:

- ✅ Validação de tipo de arquivo (apenas imagens)
- ✅ Validação de tamanho (máx 5MB)
- ✅ Geração de nomes únicos para arquivos
- ✅ Upload com cache control
- ✅ Obtenção de URL pública
- ✅ Exclusão de avatares antigos
- ✅ Tratamento de erros

## 8. Funcionalidades Implementadas

### MemberCreate.jsx
- Upload de avatar ao criar novo membro
- Preview da imagem antes do upload
- Validação de arquivo
- Fallback caso o upload falhe

### MemberEdit.jsx
- Upload de novo avatar
- Exclusão do avatar antigo ao atualizar
- Preview da imagem atual e nova
- Opção de remover avatar

## Troubleshooting

### Erro: "Supabase not configured"
- Verifique se as variáveis `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` estão no `.env`
- Reinicie o servidor de desenvolvimento

### Erro: "new row violates row-level security policy"
- Verifique se as políticas RLS foram criadas corretamente
- Certifique-se de que o bucket está marcado como público

### Imagem não aparece
- Verifique se o bucket `avatars` está público
- Verifique a política de SELECT (leitura pública)
- Inspecione a URL gerada no console do navegador

### Upload falha
- Verifique o tamanho do arquivo (máx 5MB)
- Verifique o tipo do arquivo (apenas imagens)
- Verifique as políticas de INSERT no Supabase

## Alternativa: Upload Local (sem Supabase)

Se preferir não usar Supabase Storage, você pode:

1. Configurar upload local no backend usando `multer`
2. Salvar arquivos em `/public/uploads/avatars`
3. Servir arquivos estáticos via Express

Mas o Supabase Storage é recomendado por:
- ✅ CDN global (mais rápido)
- ✅ Backup automático
- ✅ Escalabilidade
- ✅ Sem necessidade de gerenciar armazenamento no servidor
