export class UsuariosResponse {
  idUsuario: number;
  login: string;
  nome: string;
  prefeituraId: number;
  nomePrefeitura?: string;
  grupo: string;
  acoes?: string;
  isSuperAdmin: boolean;
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
