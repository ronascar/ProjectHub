#!/bin/bash

# Script para preparar frontend para deploy na Vercel

echo "🎨 Preparando Frontend para Deploy na Vercel..."

# Copiar package.json do frontend
cp package.frontend.json package.json

# Criar .env de exemplo
cp .env.frontend.example .env.production

echo "✅ Frontend preparado!"
echo ""
echo "📋 Próximos passos:"
echo "1. Edite .env.production com a URL do seu backend"
echo "2. Faça commit e push para o GitHub"
echo "3. Importe o projeto na Vercel"
echo "4. Configure a variável VITE_API_URL"
echo ""
echo "Variável necessária:"
echo "- VITE_API_URL=https://seu-backend.onrender.com"
