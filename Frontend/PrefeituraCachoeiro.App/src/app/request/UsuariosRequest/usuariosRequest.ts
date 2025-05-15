import { BaseFilter } from "src/app/request/baseFilter";

export class UsuariosRequest extends BaseFilter
{
    nome?: string = '';
}

export class CriarUsuariosRequest
{
    login: string = '';
    nome: string = '';
    senha: string = '';
    prefeituraId?: number;
    isSuperAdmin: boolean = false;
}

export class AtualizarUsuariosRequest
{
    id: number;
    login: string = '';
    nome: string = '';
    senha: string = '';
    prefeituraId: number;
}
