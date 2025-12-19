@echo off
echo ========================================
echo TESTE DE BUILD - VERCEL
echo ========================================
echo.

cd app

echo [1/4] Limpando build anterior...
if exist dist rmdir /s /q dist
echo ✓ Limpo!
echo.

echo [2/4] Instalando dependencias...
call npm install
echo ✓ Instalado!
echo.

echo [3/4] Fazendo build...
call npm run build
echo ✓ Build completo!
echo.

echo [4/4] Verificando arquivos...
if exist dist\index.html (
    echo ✓ index.html encontrado!
) else (
    echo ✗ ERRO: index.html NAO encontrado!
    exit /b 1
)

if exist dist\assets (
    echo ✓ Pasta assets encontrada!
) else (
    echo ✗ ERRO: Pasta assets NAO encontrada!
    exit /b 1
)

echo.
echo ========================================
echo BUILD OK! Pronto para deploy!
echo ========================================
echo.
echo Arquivos gerados:
dir dist /b
echo.
echo Para testar localmente:
echo   npm run preview
echo.
pause
