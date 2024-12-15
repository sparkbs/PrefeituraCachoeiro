export class ProjetoResponse{
    idProjeto: number = 0;
    nomeProjeto: string = '';
    nomeContrato: string;
    nomePrefeitura: string;
    recursos?: string;
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