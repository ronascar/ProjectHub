#!/bin/bash
# Script para testar conectividade entre containers

echo "🔍 Testando conectividade entre containers..."
echo ""

# Encontrar o container do ProjectHub
PROJECTHUB_CONTAINER=$(docker ps --format "{{.Names}}" | grep -i projecthub | head -1)

if [ -z "$PROJECTHUB_CONTAINER" ]; then
    echo "❌ Container do ProjectHub não encontrado!"
    echo "Containers disponíveis:"
    docker ps --format "{{.Names}}"
    exit 1
fi

echo "✅ Container ProjectHub: $PROJECTHUB_CONTAINER"
echo ""

# Testar conexão com o Supabase
echo "📡 Testando conexão com supabase-db-bgcwg4k8ckk0skss4w0kgcso..."
docker exec $PROJECTHUB_CONTAINER sh -c "nc -zv supabase-db-bgcwg4k8ckk0skss4w0kgcso 5432 2>&1" || \
docker exec $PROJECTHUB_CONTAINER sh -c "ping -c 2 supabase-db-bgcwg4k8ckk0skss4w0kgcso 2>&1"

echo ""
echo "🔍 Verificando redes dos containers..."
echo ""

echo "Rede do ProjectHub:"
docker inspect $PROJECTHUB_CONTAINER | grep -A 5 "Networks"

echo ""
echo "Rede do Supabase:"
docker inspect supabase-db-bgcwg4k8ckk0skss4w0kgcso | grep -A 5 "Networks"

echo ""
echo "📋 Variáveis de ambiente do ProjectHub:"
docker exec $PROJECTHUB_CONTAINER env | grep DATABASE_URL
