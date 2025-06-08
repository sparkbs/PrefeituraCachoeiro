import { ContratoModel, ContratosResponse } from "../contratosResponse/todosContratosResponse";

export class ProjetoResponse{
    idProjeto: number = 0;
    nomeProjeto: string = '';
    nomeContrato?: string;
    idPrefeitura?: number = 0; 
    nomePrefeitura?: string;
    codigoProjeto: number;
    contratos: ContratoModel[];
    acoes?: string;
}

export class MensagemProjetoResponse{
    mensagem: string = '';
}


export class ProjetosResponse {
    data: ProjetoResponse[];
    totalRegisters: number;
  }

  export class RetornaProjetoIdResponse{
    idProjeto: number = 0;
}
