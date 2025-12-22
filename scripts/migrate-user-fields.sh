#!/bin/bash

# Script para aplicar migração de campos de usuário
# Uso: ./scripts/migrate-user-fields.sh

echo "🔄 Aplicando migração: Adicionar campos pessoais e de endereço"
echo ""

# Encontrar o container do NexusPM
CONTAINER=$(docker ps --filter "name=noow000ogg08koo80wock0s0" --format "{{.Names}}" | head -n 1)

if [ -z "$CONTAINER" ]; then
    echo "❌ Container do NexusPM não encontrado!"
    echo "Execute: docker ps | grep noow000ogg08koo80wock0s0"
    exit 1
fi

echo "✅ Container encontrado: $CONTAINER"
echo ""

# Executar migração
echo "📊 Executando migração no banco de dados..."
docker exec -i $CONTAINER npx prisma db push --skip-generate

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Migração aplicada com sucesso!"
    echo ""
    echo "📋 Campos adicionados à tabela users:"
    echo "   - cpf (TEXT)"
    echo "   - birthDate (TIMESTAMP)"
    echo "   - cep (TEXT)"
    echo "   - street (TEXT)"
    echo "   - number (TEXT)"
    echo "   - complement (TEXT)"
    echo "   - neighborhood (TEXT)"
    echo "   - city (TEXT)"
    echo "   - state (TEXT)"
    echo ""
    echo "🎉 Sistema pronto para usar os novos campos!"
else
    echo ""
    echo "❌ Erro ao aplicar migração!"
    echo "Tente executar manualmente:"
    echo "  docker exec -it $CONTAINER npx prisma db push"
    exit 1
fi
