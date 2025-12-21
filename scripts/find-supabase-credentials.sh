#!/bin/bash

# Script para encontrar credenciais do Supabase na VPS
# Execute na VPS onde o Supabase está instalado

echo "🔍 Procurando credenciais do Supabase..."
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Verificar se Supabase está rodando
echo -e "${BLUE}1. Verificando containers do Supabase...${NC}"
if docker ps | grep -q supabase; then
    echo -e "${GREEN}✅ Supabase está rodando${NC}"
    docker ps | grep supabase | awk '{print "   - " $NF}'
else
    echo -e "${YELLOW}⚠️  Nenhum container do Supabase encontrado${NC}"
fi
echo ""

# 2. Procurar arquivo .env do Supabase
echo -e "${BLUE}2. Procurando arquivo .env do Supabase...${NC}"
SUPABASE_DIRS=(
    "/opt/supabase"
    "/var/lib/supabase"
    "$HOME/supabase"
    "/srv/supabase"
    "$(pwd)"
)

ENV_FILE=""
for dir in "${SUPABASE_DIRS[@]}"; do
    if [ -f "$dir/.env" ]; then
        ENV_FILE="$dir/.env"
        echo -e "${GREEN}✅ Encontrado: $ENV_FILE${NC}"
        break
    fi
done

if [ -z "$ENV_FILE" ]; then
    echo -e "${YELLOW}⚠️  Arquivo .env não encontrado automaticamente${NC}"
    echo "   Procure manualmente em: docker-compose.yml ou volumes do Docker"
else
    echo ""
    echo -e "${BLUE}3. Extraindo credenciais...${NC}"
    echo ""
    
    # Extrair ANON_KEY
    if grep -q "ANON_KEY" "$ENV_FILE"; then
        ANON_KEY=$(grep "ANON_KEY" "$ENV_FILE" | grep -v "^#" | cut -d'=' -f2- | tr -d '"' | tr -d "'")
        echo -e "${GREEN}ANON_KEY encontrada:${NC}"
        echo "VITE_SUPABASE_ANON_KEY=$ANON_KEY"
        echo ""
    fi
    
    # Extrair URL
    if grep -q "API_EXTERNAL_URL\|PUBLIC_REST_URL" "$ENV_FILE"; then
        API_URL=$(grep -E "API_EXTERNAL_URL|PUBLIC_REST_URL" "$ENV_FILE" | grep -v "^#" | head -1 | cut -d'=' -f2- | tr -d '"' | tr -d "'")
        echo -e "${GREEN}URL da API encontrada:${NC}"
        echo "VITE_SUPABASE_URL=$API_URL"
        echo ""
    fi
fi

# 4. Verificar via docker inspect
echo -e "${BLUE}4. Verificando variáveis de ambiente dos containers...${NC}"
KONG_CONTAINER=$(docker ps | grep kong | awk '{print $NF}')
if [ ! -z "$KONG_CONTAINER" ]; then
    echo -e "${GREEN}Container Kong encontrado: $KONG_CONTAINER${NC}"
    
    # Tentar extrair URL
    KONG_URL=$(docker inspect $KONG_CONTAINER | grep -i "KONG_DNS_ORDER\|API_EXTERNAL_URL" | head -1)
    if [ ! -z "$KONG_URL" ]; then
        echo "URL do Kong: $KONG_URL"
    fi
fi
echo ""

# 5. Verificar portas expostas
echo -e "${BLUE}5. Portas expostas do Supabase:${NC}"
docker ps | grep supabase | awk '{print $NF " -> " $(NF-1)}'
echo ""

# 6. Sugestões
echo -e "${BLUE}6. Próximos passos:${NC}"
echo ""
echo "📝 Adicione no arquivo .env do seu projeto:"
echo ""
echo "# Supabase Self-Hosted (VPS)"
if [ ! -z "$API_URL" ]; then
    echo "VITE_SUPABASE_URL=$API_URL"
else
    echo "VITE_SUPABASE_URL=https://seu-dominio.com  # ou http://IP:8000"
fi

if [ ! -z "$ANON_KEY" ]; then
    echo "VITE_SUPABASE_ANON_KEY=$ANON_KEY"
else
    echo "VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui"
fi
echo ""

echo -e "${YELLOW}💡 Dicas:${NC}"
echo "   - A URL geralmente é: https://supabase.seu-dominio.com ou http://IP:8000"
echo "   - Se não encontrou as chaves, verifique:"
echo "     * docker-compose.yml"
echo "     * Variáveis de ambiente do Coolify"
echo "     * Logs dos containers: docker logs supabase-kong"
echo ""

echo -e "${BLUE}7. Testar conexão:${NC}"
echo ""
if [ ! -z "$API_URL" ]; then
    echo "curl $API_URL/rest/v1/"
else
    echo "curl https://seu-dominio.com/rest/v1/"
fi
echo ""

echo "✅ Script concluído!"
