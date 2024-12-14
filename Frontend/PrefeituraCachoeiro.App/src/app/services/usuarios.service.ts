import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Environments } from '../environments/Environments';
import { GenericResultResponse } from '../response/genericResultResponse';
import { GrupoResponse } from '../response/grupoResponse/grupoResponse';
import { TodosGruposResponse } from '../response/grupoResponse/todosGruposResponse';
import { AtualizaGruposRequest, GruposRequest } from '../request/GruposRequest/gruposRequest';
import { CriarUsuariosResponse, ListaUsuariosResponse, UsuariosMensagemResponse, UsuariosResponse } from '../response/usuariosResponse/usuariosResponse';
import { AtualizarUsuariosRequest, CriarUsuariosRequest, UsuariosRequest } from '../request/UsuariosRequest/usuariosRequest';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  constructor(private readonly http: HttpClient) { }

  public async BuscarUsuario(id: number) : Promise<GenericResultResponse<UsuariosResponse>>{
    return await firstValueFrom(
      this.http.get<GenericResultResponse<UsuariosResponse>>(
        `${Environments.APIUrl}/usuarios?id=${id}`
      )
    );
  }

  public async DeletarUsuarios(id: number): Promise<GenericResultResponse<UsuariosMensagemResponse>> {
    return await firstValueFrom(
      this.http.delete<GenericResultResponse<UsuariosMensagemResponse>>(
        `${Environments.APIUrl}/usuarios?id=${id}`
      )
    );
  }

  public async BuscarTodosUsuarios(filter: UsuariosRequest): Promise<ListaUsuariosResponse> {
    return await firstValueFrom(
      this.http.post<ListaUsuariosResponse>(
        `${Environments.APIUrl}/usuarios/buscartodos`,
        filter
      )
    );
  }

  public async CriarUsuarios(usuarios: CriarUsuariosRequest): Promise<GenericResultResponse<CriarUsuariosResponse>> {
    return await firstValueFrom(
      this.http.post<GenericResultResponse<CriarUsuariosResponse>>(
        `${Environments.APIUrl}/usuarios`,
        usuarios
      )
    );
  }

  public async AtualizarUsuarios(request: AtualizarUsuariosRequest): Promise<GenericResultResponse<CriarUsuariosResponse>> {
    return await firstValueFrom(
      this.http.put<GenericResultResponse<CriarUsuariosResponse>>(
        `${Environments.APIUrl}/usuarios`,
        request
      )
    );
  }


}
