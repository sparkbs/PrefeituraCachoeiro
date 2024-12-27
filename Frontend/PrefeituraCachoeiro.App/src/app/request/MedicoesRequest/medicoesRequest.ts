import { BaseFilter } from "src/app/request/baseFilter";
import { PermissoesItemsRequest } from "../PermissoesRequest/permissoesRequest";

export class MedicoesRequest extends BaseFilter
{
    idContrato: number;
    statusMedicao?: number;
    idMedicaoAtual?: number;
}

export class InserirMedicao {
    numeroMedicao: number = 0;
    idContrato: number = 0;
    dataMedicao: Date;
    resumo: string = "";
    idProjeto: number = 0;
    items: PermissoesItemsRequest[] = [];
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
  