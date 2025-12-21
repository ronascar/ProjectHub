#!/bin/bash
# Script para conectar ProjectHub à rede do Supabase automaticamente

echo "🔗 Conectando ProjectHub à rede do Supabase..."

# Encontrar o container do ProjectHub
PROJECTHUB_CONTAINER=$(docker ps --format "{{.Names}}" | grep "noow000ogg08koo80wock0s0" | head -1)

if [ -z "$PROJECTHUB_CONTAINER" ]; then
    echo "❌ Container do ProjectHub não encontrado!"
    exit 1
fi

echo "✅ Container encontrado: $PROJECTHUB_CONTAINER"

# Verificar se já está conectado à rede
ALREADY_CONNECTED=$(docker inspect $PROJECTHUB_CONTAINER | grep -c "bgcwg4k8ckk0skss4w0kgcso")

if [ "$ALREADY_CONNECTED" -gt 0 ]; then
    echo "✅ Já está conectado à rede do Supabase!"
    exit 0
fi

# Conectar à rede do Supabase
echo "🔌 Conectando à rede bgcwg4k8ckk0skss4w0kgcso..."
docker network connect bgcwg4k8ckk0skss4w0kgcso $PROJECTHUB_CONTAINER

if [ $? -eq 0 ]; then
    echo "✅ Conectado com sucesso!"
    echo "🔄 Reiniciando container..."
    docker restart $PROJECTHUB_CONTAINER
    echo "✅ Pronto! O sistema deve estar funcionando."
else
    echo "❌ Erro ao conectar à rede!"
    exit 1
fi
