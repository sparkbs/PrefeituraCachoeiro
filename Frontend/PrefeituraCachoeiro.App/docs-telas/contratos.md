# Tela Contratos

A tela de **Contratos** permite o cadastro, edição, visualização e gerenciamento de contratos vinculados a clientes (prefeituras/empresas). Inclui listagem, filtros, ações rápidas e modais para cadastro/edição e anexos/aditivos.

## Visão Geral

- **Listagem em tabela** dos contratos, exibindo: Cliente, Número do Contrato, Data de início/término, Valor e Ações.
- **Filtro instantâneo** por texto, permitindo localizar rapidamente contratos pelo número, cliente ou status.
- **Paginação** para navegação eficiente.
- **Botão de adicionar contrato** abre modal para cadastro.
- **Ações rápidas**: editar, remover, visualizar anexos/aditivos.

## Fluxos e Funcionalidades

### 1. Listagem e Filtro

- Tabela exibe todos os contratos cadastrados, com colunas:
  - **Cliente**
  - **Número do Contrato**
  - **Data de início/término**
  - **Valor**
  - **Ações**
- Filtro por texto nas colunas principais.
- Paginação automática.

### 2. Cadastro/Edição de Contrato

- Modal com formulário reativo para cadastro/edição.
- **Campos:**
  - Cliente (select obrigatório)
  - Número do contrato (obrigatório)
  - Datas de início e término (obrigatórias)
  - Valor (obrigatório)
  - Anexos (opcional)
- **Validações:**
  - Todos os campos obrigatórios devem ser preenchidos.
  - Datas válidas e valor numérico.
- **Fluxo:**
  1. Selecionar cliente
  2. Preencher dados
  3. Salvar

### 3. Exclusão de Contrato

- Ação de remover contrato com confirmação.
- Feedback visual de sucesso/erro.

### 4. Anexos e Aditivos

- Visualização e upload de anexos/aditivos vinculados ao contrato.
- Modal específico para gerenciamento desses documentos.

## Usabilidade e Experiência

- Feedback visual (loading, toasts)
- Campos desabilitados conforme contexto
- Prevenção de erros e confirmações de ações críticas

## Principais Funções
- Listagem de contratos
- Cadastro e edição de contratos
- Visualização de anexos e aditivos
- Associação de contratos a clientes

## Campos Importantes
- Número do contrato
- Cliente vinculado
- Data de início e término
- Valor

## Fluxos
1. Cadastrar novo contrato
2. Editar contrato existente
3. Visualizar anexos/aditivos 