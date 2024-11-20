export class PrefeituraResponse{
    idPrefeitura: number = 0;
    nome: string = '';
    logo: string = '';
}

export class PrefeituraDataResponse
{
    data?: PrefeituraResponse[] = [];
    totalRegisters: number = 0;
}

export class AtualizarPrefeituraResponse
{
    idPrefeitura: number = 0;
}

export class BaseFilter
{
    itemsPorPagina?: number = 0;
    pagina: number = 0;
}

export class PrefeituraFilter extends BaseFilter
{
    nome: string = '';
}