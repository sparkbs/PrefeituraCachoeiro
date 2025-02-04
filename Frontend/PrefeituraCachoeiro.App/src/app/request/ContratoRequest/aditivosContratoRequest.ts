export class AditivosContratoRequest {
    TipoAditivo: string = '';
    DataAssinaturaAditivo?: Date;
    DataValidadeAditivo?: Date;
    ContratoId: Number;
    ArquivoTemplate: File;
}