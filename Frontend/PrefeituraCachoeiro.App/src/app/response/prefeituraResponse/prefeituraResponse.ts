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