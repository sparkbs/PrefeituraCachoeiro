import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Environments } from '../environments/Environments';
import { GenericResultResponse } from '../response/genericResultResponse';
import { TodosGruposResponse } from '../response/grupoResponse/todosGruposResponse';
import { AtualizaGruposRequest, GruposRequest } from '../request/GruposRequest/gruposRequest';
import { MensagemProjetoResponse, ProjetoResponse, ProjetosResponse, RetornaProjetoIdResponse } from '../response/projetoResponse/projetoResponse';
import { AtualizarProjetoRequest, CriarProjetoRequest, ProjetoRequest } from '../request/ProjetoRequest/projetoRequest';

@Injectable({
  providedIn: 'root'
})
export class ProjetoService {
  constructor(private readonly http: HttpClient) { }

  public async BuscarProjeto(id: number) : Promise<ProjetoResponse>{
    return await firstValueFrom(
      this.http.get<ProjetoResponse>(
        `${Environments.APIUrl}/projetos/${id}`
      )
    );
  }

  public async DeletarProjeto(id: number): Promise<GenericResultResponse<MensagemProjetoResponse>> {
    return await firstValueFrom(
      this.http.delete<GenericResultResponse<MensagemProjetoResponse>>(
        `${Environments.APIUrl}/projetos/${id}`
      )
    );
  }

  public async BuscarTodosProjetos(filter: ProjetoRequest): Promise<ProjetosResponse> {
    return await firstValueFrom(
      this.http.post<ProjetosResponse>(
        `${Environments.APIUrl}/projetos/buscartodos`,
        filter
      )
    );
  }

  public async CriarProjeto(projetoRequest: CriarProjetoRequest): Promise<RetornaProjetoIdResponse> {
    const formData = new FormData();
    formData.append('Nome', projetoRequest.nome);
    formData.append('CodigoProjeto', projetoRequest.codigoProjeto.toString());

    return await firstValueFrom(
      this.http.post<RetornaProjetoIdResponse>(
        `${Environments.APIUrl}/projetos`,
        formData
      )
    );
  }

  public async AtualizarProjeto(request: AtualizarProjetoRequest): Promise<GenericResultResponse<RetornaProjetoIdResponse>> {
    const formData = new FormData();
    formData.append('id', request.id.toString());
    formData.append('nome', request.nome);
    return await firstValueFrom(
      this.http.put<GenericResultResponse<RetornaProjetoIdResponse>>(
        `${Environments.APIUrl}/projetos`,
        formData
      )
    );
  }


}
