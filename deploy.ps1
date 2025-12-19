# Script de Deploy Rápido - ProjectHub (Windows)
# Execute: .\deploy.ps1

Write-Host "🚀 ProjectHub - Deploy Rápido" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se está na pasta correta
if (-not (Test-Path "package.json")) {
    Write-Host "❌ Erro: Execute este script na raiz do projeto!" -ForegroundColor Red
    exit 1
}

Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "🔨 Fazendo build..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Erro no build! Verifique os erros acima." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Build concluído com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📤 Opções de deploy:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Deploy via Vercel CLI:" -ForegroundColor White
Write-Host "   vercel --prod" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Deploy via GitHub:" -ForegroundColor White
Write-Host "   git add ." -ForegroundColor Gray
Write-Host "   git commit -m 'Deploy v1.0.0'" -ForegroundColor Gray
Write-Host "   git push origin main" -ForegroundColor Gray
Write-Host "   Depois acesse: https://vercel.com/new" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Deploy manual:" -ForegroundColor White
Write-Host "   Arraste a pasta 'dist/' para https://vercel.com/new" -ForegroundColor Gray
Write-Host ""
Write-Host "================================" -ForegroundColor Cyan
Write-Host "✨ Pronto para deploy!" -ForegroundColor Green
