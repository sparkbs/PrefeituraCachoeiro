import { PermissoesResponse } from "../permissaoResponse/permissaoResponse";

export class TodosGruposResponse{
    data: Grupo[] = [];
    totalRegisters: number = 0;
}

export class Grupo {
    idGrupo: number = 0;
    nome: string = '';
    permissoes: PermissoesResponse[];
    acoes?: string;
}