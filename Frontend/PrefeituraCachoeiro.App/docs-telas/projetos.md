# Tela Projetos

A tela de **Projetos** permite a gestão completa dos projetos vinculados a contratos e clientes (prefeituras/empresas). É composta por uma listagem, filtros, ações rápidas e um modal para cadastro/edição.

## Visão Geral

- **Listagem em tabela** dos projetos, exibindo: Cliente, Contrato, Código, Nome e Ações.
- **Filtro instantâneo** por texto, permitindo localizar rapidamente projetos pelo nome, cliente ou contrato.
- **Paginação** para navegação eficiente em grandes volumes de dados.
- **Botão de adicionar projeto** abre um modal para cadastro.
- **Ações rápidas**: editar (lápis) e remover (lixeira) cada projeto.

## Fluxos e Funcionalidades

### 1. Listagem e Filtro

- A tabela exibe todos os projetos cadastrados, com colunas:
  - **Cliente**: nome da prefeitura/empresa vinculada.
  - **Contrato**: número do contrato associado.
  - **Código**: código identificador do projeto.
  - **Nome**: nome do projeto.
  - **Ações**: editar e remover.
- O campo de filtro permite buscar por qualquer termo presente nas colunas.
- A paginação é automática e configurável (10, 25, 100 itens por página).

### 2. Cadastro/Edição de Projeto

- Ao clicar em "Adicionar projeto" ou no ícone de edição, abre-se um modal com formulário reativo.
- **Campos do formulário:**
  - **Cliente (Prefeitura/Empresa)**: autocomplete obrigatório, filtra conforme digitação.
  - **Contrato**: select obrigatório, só habilitado após seleção do cliente, lista apenas contratos daquele cliente.
  - **Nome do Projeto**: obrigatório, só habilitado após seleção de contrato.
  - **Código do Projeto**: obrigatório, só habilitado após seleção de contrato, aceita apenas números.
- **Validações:**
  - Todos os campos são obrigatórios.
  - Código do projeto aceita apenas números.
  - Nome e código só podem ser preenchidos após seleção de cliente e contrato válidos.
- **Fluxo de cadastro:**
  1. Selecionar cliente → habilita campo contrato.
  2. Selecionar contrato → habilita campos nome e código.
  3. Preencher nome e código.
  4. Salvar: cria projeto e vincula ao contrato. Em caso de erro no vínculo, desfaz o cadastro.
- **Fluxo de edição:**
  - Campos cliente e contrato vêm preenchidos e bloqueados.
  - Permite editar nome e código.
  - Salva alterações via API.

### 3. Exclusão de Projeto

- Ao clicar no ícone de lixeira, abre-se um diálogo de confirmação.
- Se confirmado, o projeto é removido da base e da tabela.
- Feedback visual de sucesso ou erro é exibido via toast.

### 4. Recursos do Projeto

- A tela pode abrir uma tabela modal de recursos do projeto, exibindo:
  - Nome do recurso
  - Quantidade
  - Valor
- Paginação e visualização amigável.

## Usabilidade e Experiência

- **Feedback visual**: loading durante operações, toasts para sucesso/erro.
- **Acessibilidade**: uso de Angular Material, tooltips, navegação por teclado.
- **Responsividade**: layout adaptável, botões e campos com espaçamento adequado.
- **Prevenção de erros**: campos desabilitados até que etapas anteriores sejam cumpridas. 