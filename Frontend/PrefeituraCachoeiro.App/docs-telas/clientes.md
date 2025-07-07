# Tela Clientes (Prefeitura/Empresa)

A tela de **Clientes** permite o cadastro, edição e gerenciamento de clientes do tipo prefeitura ou empresa, que são vinculados a contratos e projetos.

## Visão Geral

- **Listagem em tabela** dos clientes, exibindo: Nome, Tipo, CNPJ, Endereço e Ações.
- **Filtro instantâneo** por nome ou CNPJ.
- **Paginação** para grandes volumes.
- **Botão de adicionar cliente** abre modal para cadastro.
- **Ações rápidas**: editar e remover.

## Fluxos e Funcionalidades

### 1. Listagem e Filtro

- Tabela exibe todos os clientes cadastrados.
- Filtro por nome ou CNPJ.
- Paginação automática.

### 2. Cadastro/Edição de Cliente

- Modal com formulário reativo.
- **Campos:**
  - Nome (obrigatório)
  - Tipo (Prefeitura/Empresa, obrigatório)
  - CNPJ (obrigatório, validado)
  - Endereço (opcional)
- **Validações:**
  - Todos os campos obrigatórios
  - CNPJ válido
- **Fluxo:**
  1. Preencher dados
  2. Salvar

### 3. Exclusão de Cliente

- Ação de remover cliente com confirmação.
- Feedback visual de sucesso/erro.

## Usabilidade e Experiência

- Feedback visual (loading, toasts)
- Campos desabilitados conforme contexto
- Prevenção de erros e confirmações de ações críticas

## Principais Funções
- Listagem de clientes
- Cadastro e edição de clientes
- Associação de clientes a contratos e projetos

## Campos Importantes
- Nome do cliente
- Tipo (Prefeitura/Empresa)
- CNPJ
- Endereço

## Fluxos
1. Cadastrar novo cliente
2. Editar cliente existente 