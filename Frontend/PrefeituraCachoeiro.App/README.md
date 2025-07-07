# ProjetaApp

**ProjetaApp** é uma aplicação web desenvolvida em Angular para gestão de projetos, contratos, clientes (prefeituras/empresas) e medições, com foco em obras e serviços de engenharia.

## ✨ Funcionalidades Principais

- **Autenticação de Usuários**: Login seguro e controle de acesso por perfil.
- **Gestão de Projetos**: Criação, edição e visualização de projetos vinculados a contratos e clientes.
- **Gestão de Contratos**: Cadastro e gerenciamento de contratos associados a clientes.
- **Gestão de Clientes (Prefeituras/Empresas)**: Cadastro e configuração de clientes.
- **Medições e Boletins**: Registro, detalhamento e emissão de boletins de medição, com geração de relatórios em PDF.
- **Relatórios**: Visualização de relatórios de medições, projetos e históricos, incluindo integração com PowerBI.
- **Interface Moderna**: Utilização de Angular Material para uma experiência de usuário intuitiva e responsiva.

## 🚀 Como rodar o projeto

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm start
   ```
   Acesse em [http://localhost:4200](http://localhost:4200)


## 🗂️ Estrutura do Projeto

- `src/app/authentication/` - Módulo de autenticação (login, registro)
- `src/app/main/` - Funcionalidades principais (home, projetos, contratos, clientes, medições, relatórios)
- `src/app/services/` - Serviços de integração com backend e utilitários
- `src/app/layout/` - Componentes de layout (sidebar, navbar)
- `src/app/shared/` - Componentes e serviços compartilhados

## 🛠️ Scripts Úteis

- `npm start` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm test` - Executa os testes unitários

## 📦 Dependências Principais

- Angular 16+
- Angular Material
- Bootstrap 5
- json-server (mock de API)
- jsPDF, pdfmake (geração de PDFs)
- PowerBI (relatórios)

## 👤 Contribuição

