export class PermissoesRequest 
{
    numeroMedicao: number = 0;
    idContrato: number = 0;
    dataMedicao: Date;
    resumo: string = "";
    idProjeto: number = 0;
    items: PermissoesItemsRequest[] = [];
}

export class PermissoesItemsRequest 
{
    idItemContrato: number = 0;
    unidade: number = 0;
}