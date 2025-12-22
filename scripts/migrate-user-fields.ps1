# Script para aplicar migração de campos de usuário
# Uso: .\scripts\migrate-user-fields.ps1

Write-Host "🔄 Aplicando migração: Adicionar campos pessoais e de endereço" -ForegroundColor Cyan
Write-Host ""

# Encontrar o container do NexusPM
$containers = docker ps --filter "name=noow000ogg08koo80wock0s0" --format "{{.Names}}"
$container = $containers | Select-Object -First 1

if ([string]::IsNullOrEmpty($container)) {
    Write-Host "❌ Container do NexusPM não encontrado!" -ForegroundColor Red
    Write-Host "Execute: docker ps | grep noow000ogg08koo80wock0s0"
    exit 1
}

Write-Host "✅ Container encontrado: $container" -ForegroundColor Green
Write-Host ""

# Executar migração
Write-Host "📊 Executando migração no banco de dados..." -ForegroundColor Yellow
docker exec -i $container npx prisma db push --skip-generate

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Migração aplicada com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📋 Campos adicionados à tabela users:" -ForegroundColor Cyan
    Write-Host "   - cpf (TEXT)"
    Write-Host "   - birthDate (TIMESTAMP)"
    Write-Host "   - cep (TEXT)"
    Write-Host "   - street (TEXT)"
    Write-Host "   - number (TEXT)"
    Write-Host "   - complement (TEXT)"
    Write-Host "   - neighborhood (TEXT)"
    Write-Host "   - city (TEXT)"
    Write-Host "   - state (TEXT)"
    Write-Host ""
    Write-Host "🎉 Sistema pronto para usar os novos campos!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Erro ao aplicar migração!" -ForegroundColor Red
    Write-Host "Tente executar manualmente:"
    Write-Host "  docker exec -it $container npx prisma db push"
    exit 1
}
