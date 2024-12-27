import { BaseFilter } from "src/app/request/baseFilter";

export class GruposRequest extends BaseFilter
{
    nome?: string = '';
}

export class AtualizaGruposRequest
{
    id: number = 0;
    nome: string = '';
}