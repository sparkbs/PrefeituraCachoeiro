import { Item } from "./dadosContratoResponse";

export class TodosContratosResponse{
    data: ContratosResponse[] = [];
    totalRegisters: number = 0;
}

export class Grupo {
    idGrupo: number = 0;
    nome: string = '';
}

export interface ContratosResponse {
    arquivos?: string[]
    idContrato: number;
    projeto: ProjetoResponse;
    dataContrato: Date;
    numeroContrato?: string;
    valorTotalPrevisto?: number;
    valorTotalSolicitado?: number;
    valorAtualContrato?: number;
    valorTotalMedido?: number;
    valorSaldoRestante?: number;
    items: ItemsContratoResponse[];
    empresaId?: number;
    empresa: EmpresaResponse;
    valor: string;
    tipoContratacao: number;
    gerente: string;
    dataTermino?: Date;
    dataInicio?: Date;
    dataTerminoAtualizada?: Date;
    prefeituraId?: number;
    prefeitura: PrefeituraResponse;
  }
  
  export interface ProjetoResponse {
    idProjeto: number;
    nomeProjeto?: string;
  }
  
  export interface ItemsContratoResponse {
    idItemContrato: number;
    idContrato: number;
    itemId: number;
    item: ItemResponse;
    quantidadeId: number;
    quantidade: QuantidadeResponse;
    unidade: number;
    valorSemBdi: number;
    valorComBdi: number;
    valorTotalComBdi: number;
  }
  
  export interface ItemResponse {
    idItem: number;
    identificador?: string;
    codigo?: string;
    origemId: number;
    origem: OrigemResponse;
    descricao?: string;
    unidade?: number;
    quantidadeId?: number;
    quantidade: QuantidadeResponse;
    valorSemBdi?: number;
    valorComBdi?: number;
    valorTotalComBdi?: number;
    idItemPai?: number;
    ordem: number;
  }
  
  export interface OrigemResponse {
    idOrigem: number;
    nome?: string;
  }
  
  export interface QuantidadeResponse {
    idQuantidade: number;
    nome?: string;
  }
  
  export interface EmpresaResponse {
    empresaId: number;
    nome: string;
    logo: string;
  }
  
  export interface PrefeituraResponse {
    idPrefeitura: number;
    nome: string;
    logo: string;
  }

  export class ContratoModel {
    contratos: ContratosResponse;
    idContrato: number;
    idContratoProjeto: number;
    idProjeto: number;
  }
  
  export interface ContratosAditivosResponse {
    idAditivo: number,
    contratoId: number,
    dataAssinatura: Date,
    dataValidade: Date,
    tipoAditivo: string
    valorTotal: number;
    items: ItemsAditivosResponse[]
  }

  export interface ItemsAditivosResponse {
    aditivoId: number,
    idItemAditivo: number,
    item: Item,
    itemId: number,
    quantidadeId: number,
    unidade: number,
    valorComBdi: number,
    valorSemBdi: number,
    valorTotalComBdi: number,
  }