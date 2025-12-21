# 🎯 Escolher Opção de Git no Coolify

## 📋 As 3 Opções Disponíveis

### 1️⃣ Public Repository
**Quando usar:** Repositório público no GitHub
**Seu caso:** ❌ Não (seu repo é privado)

### 2️⃣ Private Repository (with GitHub App)
**Quando usar:** Repositório privado com GitHub App configurado
**Seu caso:** ❌ Não (você não tem GitHub App configurado ainda)

### 3️⃣ Private Repository (with Deploy Key) ⭐
**Quando usar:** Repositório privado com chave SSH
**Seu caso:** ✅ **SIM! Use esta opção!**

---

## 🚀 SOLUÇÃO: Use "Private Repository (with Deploy Key)"

Esta é a opção mais simples para repositórios privados!

### PASSO 1: Clicar na Opção
1. Clique em **"Private Repository (with Deploy Key)"**

### PASSO 2: Preencher Informações

Você vai ver uma tela pedindo:

#### Git Repository URL
```
https://github.com/ronascar/ProjectHub.git
```

Ou formato SSH (recomendado):
```
git@github.com:ronascar/ProjectHub.git
```

#### Branch
```
main
```
(ou `master` se for o nome da sua branch principal)

### PASSO 3: Gerar Deploy Key

O Coolify vai gerar automaticamente uma **chave SSH pública**.

Você vai ver algo como:
```
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC...
```

**Copie essa chave!**

### PASSO 4: Adicionar Deploy Key no GitHub

1. Vá no seu repositório: https://github.com/ronascar/ProjectHub
2. Clique em **Settings** (do repositório)
3. No menu lateral, clique em **Deploy keys**
4. Clique em **Add deploy key**
5. Preencha:
   ```
   Title: Coolify Deploy Key
   Key: [Cole a chave SSH que o Coolify gerou]
   ```
6. ✅ Marque **"Allow write access"** (importante!)
7. Clique em **Add key**

### PASSO 5: Voltar ao Coolify

1. Clique em **Continue** ou **Save**
2. O Coolify vai testar a conexão
3. Se tudo estiver certo, vai aparecer ✅

---

## 📝 Passo a Passo Visual

```
Coolify
  ↓
Escolher: "Private Repository (with Deploy Key)"
  ↓
Preencher: URL do repo + Branch
  ↓
Copiar: Chave SSH gerada pelo Coolify
  ↓
GitHub → Settings → Deploy keys → Add
  ↓
Colar: Chave SSH
  ↓
Marcar: "Allow write access"
  ↓
Voltar ao Coolify → Continue
  ↓
✅ Conectado!
```

---

## 🐛 Se Der Erro

### Erro: "Permission denied"
**Solução:** Você esqueceu de marcar "Allow write access" no GitHub

### Erro: "Repository not found"
**Solução:** Verifique se a URL está correta

### Erro: "Invalid key"
**Solução:** Copie a chave completa (incluindo `ssh-rsa` no início)

---

## ✅ Depois de Conectar

Você vai poder:
1. Escolher o repositório
2. Escolher a branch
3. Configurar o build
4. Adicionar variáveis de ambiente
5. Fazer deploy!

---

## 🎯 Próximo Passo

**Clique em "Private Repository (with Deploy Key)" e me avise quando aparecer a chave SSH para copiar!**

Vou te ajudar a adicionar no GitHub! 🚀
