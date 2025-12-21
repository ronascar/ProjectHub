@echo off
REM Script para preparar backend para deploy no Render (Windows)

echo 🔧 Preparando Backend para Deploy no Render...

REM Copiar package.json do backend
copy package.backend.json package.json

REM Criar .env de exemplo
copy .env.backend.example .env

echo ✅ Backend preparado!
echo.
echo 📋 Próximos passos:
echo 1. Faça commit e push para o GitHub
echo 2. Configure o Web Service no Render
echo 3. Adicione as variáveis de ambiente
echo.
echo Variáveis necessárias:
echo - DATABASE_URL
echo - JWT_SECRET
echo - NODE_ENV=production
echo - PORT=10000
echo - FRONTEND_URL
echo - CORS_ALLOW_ALL=false

pause
