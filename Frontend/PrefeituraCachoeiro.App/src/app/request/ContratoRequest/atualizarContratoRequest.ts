export class AtualizarContratoRequest {
    IdProjeto: number = 0;
    IdContrato: number = 0;
    DataContrato: string;
    NumeroContrato: string = '';
    EmpresaId: number = 2;
    TipoContratacao: number = 0;
    Gerente: string = '';
    DataInicio: string;
    DataTermino: string;
    DataTerminoAtualizada: string;
    PrefeituraId: number;
    GerenteId: number;
}