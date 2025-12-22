# Migrações do Banco de Dados

Este diretório contém as migrações SQL para o banco de dados do NexusPM.

## Como Aplicar Migrações

### Opção 1: Script Automático (Recomendado)

**No servidor (Linux):**
```bash
chmod +x scripts/migrate-user-fields.sh
./scripts/migrate-user-fields.sh
```

**No Windows (PowerShell):**
```powershell
.\scripts\migrate-user-fields.ps1
```

### Opção 2: Manualmente via Container

1. Encontre o container do NexusPM:
```bash
docker ps | grep noow000ogg08koo80wock0s0
```

2. Execute a migração:
```bash
docker exec -it CONTAINER_NAME npx prisma db push
```

### Opção 3: SQL Direto no Supabase Studio

1. Acesse o Supabase Studio: `https://db.otimizacut.com.br`
2. Vá em SQL Editor
3. Cole o conteúdo do arquivo `add_user_personal_data.sql`
4. Execute o SQL

## Migração Atual: add_user_personal_data.sql

**Data:** 2025-12-22  
**Descrição:** Adiciona campos de dados pessoais e endereço à tabela users

**Campos adicionados:**
- `cpf` - CPF do usuário
- `birthDate` - Data de nascimento
- `cep` - CEP do endereço
- `street` - Logradouro (rua, avenida, etc.)
- `number` - Número do endereço
- `complement` - Complemento (apto, bloco, etc.)
- `neighborhood` - Bairro
- `city` - Cidade
- `state` - Estado (UF)

**Impacto:**
- ✅ Não afeta dados existentes
- ✅ Todos os campos são opcionais (nullable)
- ✅ Compatível com versões anteriores

## Verificação Pós-Migração

Após aplicar a migração, verifique se os campos foram criados:

```sql
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users'
AND column_name IN ('cpf', 'birthDate', 'cep', 'street', 'number', 'complement', 'neighborhood', 'city', 'state');
```

## Rollback

Se necessário, para reverter a migração:

```sql
ALTER TABLE "users" DROP COLUMN IF EXISTS "cpf";
ALTER TABLE "users" DROP COLUMN IF EXISTS "birthDate";
ALTER TABLE "users" DROP COLUMN IF EXISTS "cep";
ALTER TABLE "users" DROP COLUMN IF EXISTS "street";
ALTER TABLE "users" DROP COLUMN IF EXISTS "number";
ALTER TABLE "users" DROP COLUMN IF EXISTS "complement";
ALTER TABLE "users" DROP COLUMN IF EXISTS "neighborhood";
ALTER TABLE "users" DROP COLUMN IF EXISTS "city";
ALTER TABLE "users" DROP COLUMN IF EXISTS "state";
```

⚠️ **Atenção:** O rollback irá apagar todos os dados desses campos!
