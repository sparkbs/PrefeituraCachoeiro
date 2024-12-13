export class CriarContratoRequest {
    DataContrato: Date;
    NumeroContrato: string = "";
    EmpresaId: number;
    Valor: string;
    TipoContratacao: number;
    Gerente: string = "";
    DataInicio: Date;
    DataTermino: Date;
    PrefeituraId: number;
}
