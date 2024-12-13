import { BaseFilter } from "src/app/request/baseFilter";

export class MedicoesRequest extends BaseFilter
{
    idContrato: number;
    statusMedicao?: number;
    idMedicaoAtual?: number;
}

export class InserirMedicao {
    numeroMedicao: number;
    idContrato: number;
    dataMedicao: string; // ou Date, se preferir
    resumo: string;
    items: ItemMedicao[];
  }
  
  export class ItemMedicao {
    idItemContrato: number;
    unidade: number;
  }

export class AprovarMedicoesRequest{
    arquivos: string[];
    idMedicoesProjeto: number;
    dataRegistro: string;
    resumo: string;
}

export class DadosMedicoesRequest{
    idMedicoesProjeto: number;
    dataRegistro: string;
    resumo: string;
}


export class AlterarMedicaoProjetoRequest {
    numeroMedicao: number;
    idContrato: number;
    dataMedicao: string; // ou Date, dependendo do seu uso
    resumo: string;
    items: ItemMedicao[];
    idMedicoesProjeto: number;
  }
  