# 🚀 ProjectHub - Sistema de Gerenciamento de Projetos

![NexusPM](https://img.shields.io/badge/NexusPM-Project%20Management-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![Vite](https://img.shields.io/badge/Vite-6.0-646cff)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8)

Sistema completo de gerenciamento de projetos com interface moderna e intuitiva, desenvolvido com React, Vite e TailwindCSS.

## ✨ Funcionalidades

### 📊 Dashboard
- Visão geral de projetos ativos
- Métricas e estatísticas em tempo real
- Gráficos de progresso e desempenho
- Atividades recentes da equipe

### 📋 Gerenciamento de Projetos
- **Lista de Projetos**: Visualização completa de todos os projetos
- **Kanban Board**: Gestão visual de tarefas com drag-and-drop
- **Timeline/Gantt**: Visualização temporal das atividades
- **Detalhes do Projeto**: Informações completas e histórico

### ⚙️ Configurações do Sistema
- **Identidade**: Configuração de nome da empresa e logo
- **Localização**: Fuso horário e idioma do sistema
- **RBAC**: Gerenciamento de permissões por função (Admin, Gerente, Dev, Cliente)
- **Integrações**: GitHub, Slack, Discord
- **SLAs & Automação**: Definição de tempos de resposta e resolução

### 👥 Gestão de Equipe
- Controle de usuários e permissões
- Sistema de funções (Roles)
- Atribuição de tarefas

### 🔐 Autenticação
- Sistema de login seguro
- Proteção de rotas
- Gerenciamento de sessão

## 🛠️ Tecnologias

- **Frontend**: React 18.3
- **Build Tool**: Vite 6.0
- **Estilização**: TailwindCSS 3.4
- **Roteamento**: React Router DOM 7.1
- **Ícones**: Material Symbols (Google)
- **Drag & Drop**: @dnd-kit/core
- **Fontes**: Inter (Google Fonts)

## 🎨 Design System

### Cores
- **Primary**: `#137fec` (Azul)
- **Background Light**: `#f6f7f8`
- **Background Dark**: `#101922`
- **Surface Dark**: `#192633`
- **Border Dark**: `#324d67`
- **Text Secondary**: `#92adc9`

### Tipografia
- **Fonte Principal**: Inter (sans-serif)
- **Pesos**: 400, 500, 600, 700, 900

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/ronascar/ProjectHub.git

# Entre no diretório do app
cd ProjectHub/app

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

## 🚀 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Lint
npm run lint
```

## 📁 Estrutura do Projeto

```
app/
├── src/
│   ├── components/      # Componentes reutilizáveis
│   │   └── Sidebar.jsx
│   ├── context/         # Contextos React
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── data/           # Dados mockados
│   │   └── mockData.js
│   ├── layouts/        # Layouts da aplicação
│   │   └── MainLayout.jsx
│   ├── pages/          # Páginas da aplicação
│   │   ├── Dashboard.jsx
│   │   ├── KanbanBoard.jsx
│   │   ├── Login.jsx
│   │   ├── ProjectsList.jsx
│   │   └── Settings.jsx
│   ├── App.jsx         # Componente principal
│   ├── main.tsx        # Entry point
│   └── style.css       # Estilos globais
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

## 🔑 Credenciais de Teste

```
Email: admin@example.com
Senha: admin123
```

## 🌙 Temas

O sistema suporta modo claro e escuro, com alternância automática baseada nas preferências do usuário.

## 📱 Responsividade

Interface totalmente responsiva, otimizada para:
- 📱 Mobile (< 768px)
- 💻 Tablet (768px - 1024px)
- 🖥️ Desktop (> 1024px)

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido com ❤️ por [ronascar](https://github.com/ronascar)

---

**NexusPM** - Transformando a gestão de projetos em uma experiência visual e intuitiva.
