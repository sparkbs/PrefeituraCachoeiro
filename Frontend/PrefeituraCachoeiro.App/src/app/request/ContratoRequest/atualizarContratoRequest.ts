export class AtualizarContratoRequest {
    IdProjeto: number = 0;
    IdContrato: number = 0;
    DataContrato: string;
    NumeroContrato: string = '';
    EmpresaId: number = 1;
    Valor: string = '';
    TipoContratacao: number = 0;
    Gerente: string = '';
    DataInicio: string;
    DataTermino: string;
    PrefeituraId: number;
}