-- Migration: Add personal data and address fields to users table
-- Created: 2025-12-22
-- Description: Adds CPF, birth date, and complete address fields to the users table

-- Add personal data fields
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "cpf" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "birthDate" TIMESTAMP(3);

-- Add address fields
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "cep" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "street" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "number" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "complement" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "neighborhood" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "city" TEXT;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "state" TEXT;

-- Add comments for documentation
COMMENT ON COLUMN "users"."cpf" IS 'CPF do usuário (formato: 000.000.000-00)';
COMMENT ON COLUMN "users"."birthDate" IS 'Data de nascimento do usuário';
COMMENT ON COLUMN "users"."cep" IS 'CEP do endereço (formato: 00000-000)';
COMMENT ON COLUMN "users"."street" IS 'Logradouro (rua, avenida, etc.)';
COMMENT ON COLUMN "users"."number" IS 'Número do endereço';
COMMENT ON COLUMN "users"."complement" IS 'Complemento do endereço (apto, bloco, etc.)';
COMMENT ON COLUMN "users"."neighborhood" IS 'Bairro';
COMMENT ON COLUMN "users"."city" IS 'Cidade';
COMMENT ON COLUMN "users"."state" IS 'Estado (UF)';
