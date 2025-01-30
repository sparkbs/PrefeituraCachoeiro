export class MedicoesResponse {
    idMedicoesProjeto: number;
    numeroMedicao: number;
    idContrato: number;
    contratos: Contrato;
    dataMedicao: string; // ou Date se for mais conveniente
    resumo: string;
    idStatusMedicao: number;
    statusMedicao: StatusMedicao;
    items: ItemMedicao[];
    idProjeto: number;
  }

  export class Contrato {
    idContrato: number;
    idProjeto: number;
    projetos: Projeto[];
    dataContrato: string;
    numeroContrato: string;
    valorTotalPrevisto: number;
    valorTotalSolicitado: number;
    valorTotalMedido: number;
    valorSaldoRestante: number;
    items: ItemContrato[];
    empresaId: number;
    empresa: Empresa;
    valor: number;
    tipoContratacao: number;
    gerente: string;
    dataTermino: string;
    dataInicio: string;
    prefeituraId: number;
    prefeitura: Prefeitura;
  }

  export class Projeto {
    idProjeto: number;
    nomeProjeto: string;
  }

  export class ItemContrato {
    idItemContrato: number;
    idContrato: number;
    itemId: number;
    item: Item;
    quantidadeId: number;
    quantidade: Quantidade;
    unidade: number;
    valorSemBdi: number;
    valorComBdi: number;
    valorTotalComBdi: number;
  }

  export class Item {
    idItem: number;
    identificador: string;
    codigo: string;
    origemId: number;
    origem: Origem;
    descricao: string;
    unidade: number;
    quantidadeId: number;
    quantidade: Quantidade;
    valorSemBdi: number;
    valorComBdi: number;
    valorTotalComBdi: number;
    idItemPai: number;
    ordem: number;
  }

  export class Origem {
    idOrigem: number;
    nome: string;
  }

  export class Quantidade {
    idQuantidade: number;
    nome: string;
  }

  export class StatusMedicao {
    idStatusMedicao: number;
    nome: string;
  }

  export class ItemMedicao {
    idItemMedicoesProjeto: number;
    idItemContrato: number;
    itemsContrato: ItemContrato;
    unidade: number;
    unidadeSalvaMedida?: number;
    itemInvalido?: boolean = false;
  }

  export class Empresa {
    empresaId: number;
    nome: string;
    logo: string;
  }

  export class Prefeitura {
    idPrefeitura: number;
    nome: string;
    logo: string;
  }

  export class TodasMedicaoProjetoResponse {
    data: MedicoesResponse[];
  }

  export class RetornoIdMedicao{
    idMedicoesProjeto: number;
  }

  export class RetornoReprovacaoAprovacaoResponse{
    isSucesso: boolean;
    mensagemErro: string;
  }

  export class MedicoesModel {
    numeroMedicao: number = 0;
    data: MedicoesResponse[] = [];
  }

  export class MedicaoLevantamento {
    qtdItem: number;
    idItemContrato: number;
    valorComBdi: number;
  }
