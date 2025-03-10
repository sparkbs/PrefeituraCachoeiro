export class PermissoesResponse {
  idPermissao: number;
  idTipoPermissao: number;
  tipoPermissao: PermissaoResponse;
}

export class PermissaoResponse {
  idTipoPermissao: number;
  nome: string;
}
  
export class RetornaIdPermissaoResponse {
  idPermissao: number;
}
  
export class RetornaMensagemPermissaoResponse {
  mensagem: string;
}
  
