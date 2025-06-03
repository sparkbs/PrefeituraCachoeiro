import { ArquivosAditivos, ArquivosContratoResponse } from "../contratosResponse/todosContratosResponse";

export class MedicoesResponse {
    selecionado: boolean = false;
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
    nomeProjeto: string = null;
    arquivosMedicoesProjeto: ArquivosMedicoesProjetoResponse[];
    observacao: string;
    secretaria: string;
    projetoMedicao: string;
    periodoMedicao: string;
  }

  export class BoletimMedicoesResponse {
    numeroMedicao: number;
    medicaoResponse: MedicoesResponse[];
  }

  export class ArquivosMedicoesProjetoResponse {
    id: number;
    arquivoMedicao: string;
    arquivo: string;
    idOrigemArquivo?: number;
    projeto?: string;
  }

  export class ArquivosAprovacao {
    arquivosMedicoesProjetoResponse: IdsResponse[]=[];
    arquivosContratosResponse: ArquivosContratoResponse[] =[];
    arquivosAditivosResponse: ArquivosAditivos[] = [];
    arquivosAprovacao: ArquivosMedicoesProjetoResponse[] =[];
  }

  export class Contrato {
    idContrato: number;
    idProjeto: number;
    projetos: Projeto[];
    dataContrato: string;
    numeroContrato: string;
    valorTotalPrevisto: number;
    valorAtualContrato?: number;
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
    arquivosContratos: ArquivosContratoResponse[];
    isContratoGlobal: boolean;
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
    unidadeOriginal: number;
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
    isSucesso: boolean = false;
    mensagemErro: string;
  }

  export class MedicoesModel {
    numeroMedicao: number = 0;
    data: MedicoesResponse[] = [];
    documentos?: DocumentosMedicoesModel;
  }

  export class DocumentosMedicoesModel {
    data: IdsResponse[] = [];
  }

  export class MedicaoLevantamento {
    numeroMedicao: number;
    qtdItem: number;
    idItemContrato: number;
    valorComBdi: number;
  }


  export class BuscarArquivosMedicaoResponse {
    id: number;
    arquivoMedicao: string;
  }

  export class IdsResponse{
    id: number;
    arquivoMedicao: string;
    arquivo?: string;
  }

  export class InserirDocumentoMedicaoResponse{
    ids: IdsResponse [];
    isSucesso: boolean;
    mensagemErro: string;
  }

  export interface ItemResumo {
    nome: string;
    valorComBdi: number;
    unidadeTotal: number;
    unidadeTotalMedida: number;
  }

  export class TableMedicaoHistorico {
    numeroMedicao: number;
    statusMedicao: StatusMedicao;
    projetos: MedicoesResponse[] = [];
    mostrarTodos?: boolean;
  }
