import { BaseFilter } from "../../request/baseFilter";

export class EmpresaResponse{
    idPrefeitura: number = 0;
    nome: string = '';
    logo: string = '';
    email: string = '';
}

export class EmpresaDataResponse
{
    data?: EmpresaResponse[] = [];
    totalRegisters: number = 0;
}

export class AtualizarEmpresaResponse
{
    empresaId: number = 0;
}

export class EmpresaFilter extends BaseFilter
{
    nome: string = '';
}