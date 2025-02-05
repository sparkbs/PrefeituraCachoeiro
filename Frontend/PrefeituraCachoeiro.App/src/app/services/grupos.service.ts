import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Environments } from '../environments/Environments';
import { GenericResultResponse } from '../response/genericResultResponse';
import { GrupoResponse } from '../response/grupoResponse/grupoResponse';
import { TodosGruposResponse } from '../response/grupoResponse/todosGruposResponse';
import { AtualizaGruposRequest, GruposRequest } from '../request/GruposRequest/gruposRequest';

@Injectable({
  providedIn: 'root'
})
export class GruposService {
  constructor(private readonly http: HttpClient) { }

  public async BuscarGrupo(id: number) : Promise<GenericResultResponse<GrupoResponse>>{
    return await firstValueFrom(
      this.http.get<GenericResultResponse<GrupoResponse>>(
        `${Environments.APIUrl}/grupos?id=${id}`
      )
    );
  }

  public async DeletarGrupo(id: number): Promise<GenericResultResponse<string>> {
    return await firstValueFrom(
      this.http.delete<GenericResultResponse<string>>(
        `${Environments.APIUrl}/grupos?id=${id}`
      )
    );
  }

  public async BuscarTodosGrupos(filter: GruposRequest): Promise<TodosGruposResponse> {
    return await firstValueFrom(
      this.http.post<TodosGruposResponse>(
        `${Environments.APIUrl}/grupos/buscartodos`,
        filter
      )
    );
  }

  public async CriarGrupos(nome: string): Promise<GenericResultResponse<number>> {
    return await firstValueFrom(
      this.http.post<GenericResultResponse<number>>(
        `${Environments.APIUrl}/grupos`,
        nome
      )
    );
  }

  public async AtualizarPrefeitura(request: AtualizaGruposRequest): Promise<GenericResultResponse<number>> {
    return await firstValueFrom(
      this.http.put<GenericResultResponse<number>>(
        `${Environments.APIUrl}/grupos`,
        request
      )
    );
  }


}
