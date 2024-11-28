export class AtualizarContratoRequest {
    IdProjeto: number = 0;
    IdContrato: number = 0;
    DataContrato: Date;
    NumeroContrato: string = '';
    EmpresaId: number = 1;
    Valor: string = '';
    TipoContratacao: number = 0;
    Gerente: string = '';
    DataInicio: Date;
    DataTermino: Date;
    PrefeituraId: number;
}