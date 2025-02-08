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

  public async BuscarUsuario(id: number) : Promise<UsuariosResponse>{
    return await firstValueFrom(
      this.http.get<UsuariosResponse>(
        `${Environments.APIUrl}/usuarios/${id}`
      )
    );
  }

  public async DeletarUsuarios(id: number): Promise<GenericResultResponse<UsuariosMensagemResponse>> {
    return await firstValueFrom(
      this.http.delete<GenericResultResponse<UsuariosMensagemResponse>>(
        `${Environments.APIUrl}/usuarios/${id}`
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

  public async CriarUsuarios(usuarios: CriarUsuariosRequest): Promise<CriarUsuariosResponse> {
    const formData = new FormData();
    formData.append('Nome', usuarios.nome);
    formData.append('Login', usuarios.login);
    formData.append('Senha', usuarios.senha);
    formData.append('PrefeituraId', usuarios.prefeituraId.toString());

    return await firstValueFrom(
      this.http.post<CriarUsuariosResponse>(
        `${Environments.APIUrl}/usuarios`,
        formData
      )
    );
  }

  public async AtualizarUsuarios(request: AtualizarUsuariosRequest): Promise<GenericResultResponse<CriarUsuariosResponse>> {
    const formData = new FormData();
    formData.append('Id', request.id.toString());
    formData.append('Login', request.login);
    formData.append('Nome', request.nome);
    formData.append('Senha', request.senha);
    formData.append('PrefeituraId', request.prefeituraId.toString());
    
    return await firstValueFrom(
      this.http.put<GenericResultResponse<CriarUsuariosResponse>>(
        `${Environments.APIUrl}/usuarios`,
        formData
      )
    );
  }


}
