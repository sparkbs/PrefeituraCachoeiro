export class UsuariosResponse {
  idUsuario: number;
  login: string;
  nome: string;
}

export class UsuariosMensagemResponse {
  mensagem: string;
}

export class ListaUsuariosResponse {
  data: UsuariosResponse[];
  totalRegisters: number;
}

export class CriarUsuariosResponse
{
  idUsuario: number;
}