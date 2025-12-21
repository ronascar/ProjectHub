# 🔧 Configurar GitHub App no Coolify

## 📋 Campos para Preencher

### ✅ Campos Já Preenchidos (Deixe Como Está)
```
App Name: outstanding-ostrich-1wkgw8wew0
Organization: https://github.com/ronascar/ProjectHub.git
HTML Url: https://github.com
API Url: https://api.github.com
User: git
Port: 22
App Id: 1234567890
Installation Id: 1234567890
```

### 🔑 Campos que Você Precisa Preencher

#### 1. Client Id
- Deixe em branco por enquanto (não é obrigatório)
- Ou copie do GitHub se tiver

#### 2. Client Secret
- Deixe em branco por enquanto (não é obrigatório)
- Ou copie do GitHub se tiver

#### 3. Webhook Secret
- Deixe em branco por enquanto (não é obrigatório)
- Ou copie do GitHub se tiver

#### 4. Private Key ⭐ (IMPORTANTE)
- Clique em **"Select a private key"**
- Você precisa da chave privada do GitHub App

---

## 🔑 Como Obter a Private Key

### Opção 1: Se Você Já Tem o GitHub App

1. Acesse: https://github.com/settings/apps
2. Clique no seu GitHub App
3. Role até **"Private keys"**
4. Clique em **"Generate a private key"**
5. Baixe o arquivo `.pem`
6. No Coolify, clique em **"Select a private key"**
7. Faça upload do arquivo `.pem`

### Opção 2: Se Não Tem GitHub App Ainda

Você precisa criar um GitHub App primeiro. Vou te ajudar:

---

## 🆕 Criar GitHub App (Se Não Tem)

### 1. Acessar GitHub
1. Vá em: https://github.com/settings/apps
2. Clique em **"New GitHub App"**

### 2. Configurar o App

**GitHub App name:**
```
Coolify-ProjectHub
```

**Homepage URL:**
```
https://seu-coolify.com
```

**Webhook URL:**
```
https://seu-coolify.com/webhooks/github
```

**Webhook secret:**
```
[Gere um secret aleatório]
```

Para gerar:
```bash
openssl rand -hex 32
```

### 3. Permissions

**Repository permissions:**
- Contents: Read & write
- Metadata: Read-only
- Pull requests: Read & write
- Webhooks: Read & write

**Where can this GitHub App be installed?**
- Selecione: **Only on this account**

### 4. Criar e Instalar

1. Clique em **"Create GitHub App"**
2. Clique em **"Generate a private key"**
3. Baixe o arquivo `.pem`
4. Clique em **"Install App"**
5. Selecione seu repositório (ProjectHub)
6. Clique em **"Install"**

### 5. Copiar Informações

Após criar, copie:
- **App ID**
- **Client ID**
- **Client Secret** (se gerou)
- **Installation ID** (aparece na URL após instalar)

---

## 🎯 Solução Rápida (Recomendada)

### Se Você Já Tem Acesso ao Repositório:

**Opção Mais Simples:** Use **Personal Access Token** em vez de GitHub App!

1. No Coolify, volte e escolha **"GitHub (Personal Access Token)"**
2. Gere um token em: https://github.com/settings/tokens
3. Permissões necessárias:
   - `repo` (Full control)
   - `workflow` (Update workflows)
4. Cole o token no Coolify
5. Pronto! Muito mais simples!

---

## 📝 Preencher no Coolify

### Se Você Criou o GitHub App:

```
Client Id: [Cole do GitHub]
Client Secret: [Cole do GitHub]
Webhook Secret: [Cole o que você gerou]
Private Key: [Upload do arquivo .pem]
```

### Permissions:
Marque todas as 3:
- ✅ Content
- ✅ Metadata  
- ✅ Pull Request

---

## ✅ Depois de Configurar

1. Clique em **"Save"**
2. Clique em **"Update"** (se necessário)
3. Teste a conexão
4. Volte para criar a Application

---

## 🆘 Recomendação

**Use Personal Access Token em vez de GitHub App!**

É muito mais simples e funciona perfeitamente para projetos pessoais.

**Quer que eu te mostre como fazer com Personal Access Token?**

É só:
1. Gerar token no GitHub
2. Colar no Coolify
3. Pronto!

**Muito mais rápido!** 🚀
