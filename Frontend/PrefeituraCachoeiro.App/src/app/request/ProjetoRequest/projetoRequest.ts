import { BaseFilter } from "../baseFilter";

export class ProjetoRequest extends BaseFilter
{
    nome: string;
    idContrato?: number;
}

export class CriarProjetoRequest 
{
    nome: string = '';
}

export class AtualizarProjetoRequest
{
    id: number;
    nome: string;
}