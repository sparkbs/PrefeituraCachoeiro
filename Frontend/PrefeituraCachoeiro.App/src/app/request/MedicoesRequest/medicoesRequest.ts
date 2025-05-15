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
    idMedicoesProjeto: number = 0;
    numeroMedicao: number = 0;
    idContrato: number = 0;
    dataMedicao: Date;
    resumo: string = "";
    observacao: string = "";
    idProjeto: number = 0;
    items: PermissoesItemsRequest[] = [];
    secretaria: string;
    projetoMedicao: string;
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
    observacao: string;
    items: ItemMedicao[];
    idMedicoesProjeto: number;
    idProjeto: number;
    secretaria: string;
    resumo: string;
  }

  export class RegistroDocumentosMedicoesRequest{
    IdMedicoesProjeto: number;
    Arquivos: File;
}

export class BuscarArquivosMedicaRequest extends BaseFilter{
  IdMedicoesProjeto: number;
}

export class BuscarArquivosMedicaoIdProjRequest {
  IdMedicoesProjeto: number;
}