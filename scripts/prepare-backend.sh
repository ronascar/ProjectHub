#!/bin/bash

# Script para preparar backend para deploy no Render

echo "🔧 Preparando Backend para Deploy no Render..."

# Copiar package.json do backend
cp package.backend.json package.json

# Criar .env de exemplo
cp .env.backend.example .env

echo "✅ Backend preparado!"
echo ""
echo "📋 Próximos passos:"
echo "1. Faça commit e push para o GitHub"
echo "2. Configure o Web Service no Render"
echo "3. Adicione as variáveis de ambiente"
echo ""
echo "Variáveis necessárias:"
echo "- DATABASE_URL"
echo "- JWT_SECRET"
echo "- NODE_ENV=production"
echo "- PORT=10000"
echo "- FRONTEND_URL"
echo "- CORS_ALLOW_ALL=false"
