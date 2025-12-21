# Checklist: Funcionalidades da Página de Projetos

## Status Atual
A página de Projetos (`ProjectsList.jsx`) atualmente possui:
- ✅ Listagem de projetos
- ✅ Busca por nome/cliente
- ✅ Filtros por status
- ✅ Visualizar projeto (detalhes)
- ✅ Editar projeto (formulário completo)
- ✅ Excluir projeto
- ✅ Criar novo projeto
- ✅ Paginação

## Funcionalidades Faltantes

### 1. Edição Rápida de Status ❌
**Descrição**: Permitir mudar o status do projeto diretamente da lista sem abrir o formulário de edição.

**Implementação necessária**:
- [ ] Adicionar dropdown de status na coluna "Status" da tabela
- [ ] Criar função `handleStatusChange(projectId, newStatus)`
- [ ] Chamar API `projectsAPI.update()` apenas com o campo status
- [ ] Atualizar a lista após mudança

**Prioridade**: ALTA

---

### 2. Edição Rápida de Cliente ❌
**Descrição**: Permitir alterar o cliente do projeto diretamente da lista.

**Implementação necessária**:
- [ ] Adicionar dropdown de clientes na coluna "Cliente"
- [ ] Carregar lista de clientes via `clientsAPI.list()`
- [ ] Criar função `handleClientChange(projectId, newClientId)`
- [ ] Chamar API `projectsAPI.update()` apenas com o campo clientId
- [ ] Atualizar a lista após mudança

**Prioridade**: MÉDIA

---

### 3. Gerenciar Equipe do Projeto ❌
**Descrição**: Adicionar/remover membros da equipe do projeto diretamente da lista.

**Implementação necessária**:
- [ ] Adicionar botão "Gerenciar Equipe" no menu de ações (três pontos)
- [ ] Criar modal `TeamManagementModal` com:
  - Lista de membros atuais do projeto
  - Dropdown para adicionar novos membros
  - Botão para remover membros
  - Seleção de role do membro (LEAD, DEVELOPER, DESIGNER, QA, VIEWER)
- [ ] Criar endpoints na API:
  - `POST /api/projects/:id/members` - Adicionar membro
  - `DELETE /api/projects/:id/members/:userId` - Remover membro
  - `GET /api/projects/:id/members` - Listar membros
- [ ] Implementar no backend (`server/routes/projects.cjs`)

**Prioridade**: ALTA

---

### 4. Edição Rápida de Progresso ❌
**Descrição**: Permitir ajustar a porcentagem de progresso diretamente da lista.

**Implementação necessária**:
- [ ] Tornar a barra de progresso clicável
- [ ] Adicionar input numérico ou slider para ajustar progresso
- [ ] Criar função `handleProgressChange(projectId, newProgress)`
- [ ] Validar valor entre 0-100
- [ ] Chamar API `projectsAPI.update()` apenas com o campo progress

**Prioridade**: BAIXA

---

### 5. Filtros Avançados ❌
**Descrição**: Adicionar mais opções de filtro para facilitar a busca.

**Implementação necessária**:
- [ ] Filtro por cliente (dropdown)
- [ ] Filtro por categoria (dropdown)
- [ ] Filtro por prazo (vencendo em X dias)
- [ ] Filtro por progresso (0-25%, 26-50%, 51-75%, 76-100%)
- [ ] Botão "Limpar Filtros"

**Prioridade**: MÉDIA

---

### 6. Ações em Lote ❌
**Descrição**: Permitir selecionar múltiplos projetos e executar ações em lote.

**Implementação necessária**:
- [ ] Adicionar checkbox em cada linha da tabela
- [ ] Adicionar checkbox "Selecionar Todos" no header
- [ ] Barra de ações em lote (aparece quando há seleção):
  - Alterar status em lote
  - Arquivar projetos
  - Excluir projetos
  - Exportar selecionados
- [ ] Criar função `handleBulkAction(action, selectedIds)`

**Prioridade**: BAIXA

---

### 7. Visualização de Membros na Lista ❌
**Descrição**: Mostrar avatares dos membros da equipe diretamente na tabela.

**Implementação necessária**:
- [ ] Adicionar coluna "Equipe" na tabela
- [ ] Mostrar avatares dos membros (máximo 3 + contador)
- [ ] Tooltip ao passar o mouse mostrando nomes
- [ ] Carregar membros junto com os projetos (incluir no endpoint)

**Prioridade**: MÉDIA

---

### 8. Duplicar Projeto ❌
**Descrição**: Criar cópia de um projeto existente.

**Implementação necessária**:
- [ ] Adicionar opção "Duplicar" no menu de ações
- [ ] Modal de confirmação com opções:
  - Copiar tarefas
  - Copiar membros da equipe
  - Copiar deliverables
  - Novo nome do projeto
- [ ] Criar endpoint `POST /api/projects/:id/duplicate`
- [ ] Implementar lógica no backend

**Prioridade**: BAIXA

---

### 9. Arquivar/Desarquivar Projeto ❌
**Descrição**: Mover projetos concluídos para arquivo sem excluir.

**Implementação necessária**:
- [ ] Adicionar opção "Arquivar" no menu de ações
- [ ] Adicionar filtro "Arquivados" na barra de filtros
- [ ] Criar função `handleArchiveProject(projectId)`
- [ ] Atualizar campo `isArchived` no banco
- [ ] Projetos arquivados não aparecem na lista padrão

**Prioridade**: MÉDIA

---

### 10. Exportar Projetos ❌
**Descrição**: Exportar lista de projetos em diferentes formatos.

**Implementação necessária**:
- [ ] Botão "Exportar" na toolbar
- [ ] Opções de formato:
  - CSV
  - Excel
  - PDF
- [ ] Respeitar filtros ativos na exportação
- [ ] Criar endpoint `GET /api/projects/export?format=csv`

**Prioridade**: BAIXA

---

## Resumo de Prioridades

### 🔴 ALTA (Implementar Primeiro)
1. Edição Rápida de Status
2. Gerenciar Equipe do Projeto

### 🟡 MÉDIA (Implementar Depois)
3. Edição Rápida de Cliente
4. Filtros Avançados
5. Visualização de Membros na Lista
6. Arquivar/Desarquivar Projeto

### 🟢 BAIXA (Implementar se Houver Tempo)
7. Edição Rápida de Progresso
8. Ações em Lote
9. Duplicar Projeto
10. Exportar Projetos

---

## Próximos Passos

Para colocar em produção com funcionalidades essenciais, recomendo implementar:

1. **Edição Rápida de Status** - Essencial para gerenciamento ágil
2. **Gerenciar Equipe do Projeto** - Você mencionou que precisa dessa funcionalidade
3. **Visualização de Membros na Lista** - Complementa o item 2

Essas 3 funcionalidades tornarão a página de Projetos totalmente funcional para uso em produção.

Deseja que eu implemente alguma dessas funcionalidades agora?
