import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Environments } from '../environments/Environments';
import { GenericResultResponse } from '../response/genericResultResponse';
import { TodosGruposResponse } from '../response/grupoResponse/todosGruposResponse';
import { AtualizaGruposRequest, GruposRequest } from '../request/GruposRequest/gruposRequest';
import { MensagemProjetoResponse, ProjetoResponse, ProjetosResponse, RetornaProjetoIdResponse } from '../response/projetoResponse/projetoResponse';
import { AtualizarProjetoRequest, ProjetoRequest } from '../request/ProjetoRequest/projetoRequest';

@Injectable({
  providedIn: 'root'
})
export class ProjetoService {
  constructor(private readonly http: HttpClient) { }

  public async BuscarProjeto(id: number) : Promise<GenericResultResponse<ProjetoResponse>>{
    return await firstValueFrom(
      this.http.get<GenericResultResponse<ProjetoResponse>>(
        `${Environments.APIUrl}/projetos?id=${id}`
      )
    );
  }

  public async DeletarProjeto(id: number): Promise<GenericResultResponse<MensagemProjetoResponse>> {
    return await firstValueFrom(
      this.http.delete<GenericResultResponse<MensagemProjetoResponse>>(
        `${Environments.APIUrl}/projetos?id=${id}`
      )
    );
  }

  public async BuscarTodosProjetos(filter: ProjetoRequest): Promise<GenericResultResponse<ProjetosResponse>> {
    return await firstValueFrom(
      this.http.post<GenericResultResponse<ProjetosResponse>>(
        `${Environments.APIUrl}/projetos/buscartodos`,
        filter
      )
    );
  }

  public async CriarProjeto(nome: string): Promise<GenericResultResponse<RetornaProjetoIdResponse>> {
    return await firstValueFrom(
      this.http.post<GenericResultResponse<RetornaProjetoIdResponse>>(
        `${Environments.APIUrl}/projetos`,
        nome
      )
    );
  }

  public async AtualizarProjeto(request: AtualizarProjetoRequest): Promise<GenericResultResponse<RetornaProjetoIdResponse>> {
    return await firstValueFrom(
      this.http.put<GenericResultResponse<RetornaProjetoIdResponse>>(
        `${Environments.APIUrl}/projetos`,
        request
      )
    );
  }


}
