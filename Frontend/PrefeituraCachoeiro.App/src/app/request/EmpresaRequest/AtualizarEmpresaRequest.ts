import { BaseEmpresaRequest } from "./BaseEmpresaRequest";

export class AtualizarEmpresaRequest extends BaseEmpresaRequest {
    EmpresaId: number = 0;
}

export class DadosEnviadosAtualizarEmpresa {
    IdPrefeitura: number = 0;
    Nome: string = '';
    Email: string = '';
    Url: string = '';
}