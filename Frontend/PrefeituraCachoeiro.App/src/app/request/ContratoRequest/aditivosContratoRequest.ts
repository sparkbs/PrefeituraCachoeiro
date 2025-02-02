export class AditivosContratoRequest {
    TipoAditivo: string = '';
    DataAssinaturaAditivo?: Date;
    DataValidadeAditivo?: Date;
    Valor?: string;
    ArquivoTemplate: File;
}