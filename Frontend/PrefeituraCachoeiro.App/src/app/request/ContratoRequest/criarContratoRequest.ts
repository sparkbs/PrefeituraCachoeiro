export class CriarContratoRequest {
    DataContrato: Date;
    NumeroContrato: string = "";
    EmpresaId: number;
    TipoContratacao: number;
    Gerente: string = "";
    GerenteId: number;
    DataInicio: Date;
    DataTermino: Date;
    PrefeituraId: number;
    Aditivo?: number;
    TipoAditivo?: number;
    DataAssinaturaAditivo?: Date;
    DataValidadeAditivo?: Date;
    Arquivos: File[] = [];
    ArquivoTemplate: File;
    IsContratoGlobal: boolean;
}

export class salvarDocumentoContratoRequest {
    IdContrato: number;
    Arquivos: File[] = [];
}

export class salvarDocumentoAditivoRequest {
    IdAditivo: number;
    Arquivos: File[] = [];
}
