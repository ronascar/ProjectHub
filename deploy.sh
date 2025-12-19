#!/bin/bash
# Script de Deploy Rápido - ProjectHub
# Execute este script para fazer deploy na Vercel

echo "🚀 ProjectHub - Deploy Rápido"
echo "================================"
echo ""

# Verificar se está na pasta correta
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto!"
    exit 1
fi

echo "📦 Instalando dependências..."
npm install

echo ""
echo "🔨 Fazendo build..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Erro no build! Verifique os erros acima."
    exit 1
fi

echo ""
echo "✅ Build concluído com sucesso!"
echo ""
echo "📤 Opções de deploy:"
echo ""
echo "1. Deploy via Vercel CLI:"
echo "   vercel --prod"
echo ""
echo "2. Deploy via GitHub:"
echo "   git add ."
echo "   git commit -m 'Deploy v1.0.0'"
echo "   git push origin main"
echo "   Depois acesse: https://vercel.com/new"
echo ""
echo "3. Deploy manual:"
echo "   Arraste a pasta 'dist/' para https://vercel.com/new"
echo ""
echo "================================"
echo "✨ Pronto para deploy!"
