import { BasePrefeituraRequest } from "./BasePrefeituraRequest";

export class AtualizarPrefeituraRequest extends BasePrefeituraRequest {
    IdPrefeitura: number = 0;
}

export class DadosEnviadosAtualizarPrefeitura {
    IdPrefeitura: number = 0;
    Nome: string = '';
    Email: string = '';
    Url: string = '';
}