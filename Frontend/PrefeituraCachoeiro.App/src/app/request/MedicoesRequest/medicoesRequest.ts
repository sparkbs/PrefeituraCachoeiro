import { BaseFilter } from "src/app/request/baseFilter";
import { PermissoesItemsRequest } from "../PermissoesRequest/permissoesRequest";

export class MedicoesRequest extends BaseFilter
{
    idContrato: number;
    statusMedicao?: number;
    idMedicaoAtual?: number;
    idProjeto?: number;
}

export class InserirMedicao {
    numeroMedicao: number = 0;
    idContrato: number = 0;
    dataMedicao: Date;
    resumo: string = "";
    IdProjeto: number = 0;
    items: PermissoesItemsRequest[] = [];
  }

  export class ItemMedicao {
    idItemContrato: number;
    unidade: number;
  }

export class AprovarMedicoesRequest{
  Arquivos: File[] = [];
  IdMedicoesProjeto: number;
  DataRegistro: string;
  Resumo: string;
}

export class DadosMedicoesRequest{
    IdMedicoesProjeto: number;
    DataRegistro: string;
    Resumo: string;
}


export class AlterarMedicaoProjetoRequest {
    numeroMedicao: number;
    idContrato: number;
    dataMedicao: string; // ou Date, dependendo do seu uso
    resumo: string;
    items: ItemMedicao[];
    idMedicoesProjeto: number;
    idProjeto: number;
  }

  export class RegistroDocumentosMedicoesRequest{
    IdMedicoesProjeto: number;
    Arquivos: File[] = [];
}

export class BuscarArquivosMedicaRequest extends BaseFilter{
  IdMedicoesProjeto: number;
}
