import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Environments } from '../environments/Environments';
import { GenericResultResponse } from '../response/genericResultResponse';
import { CriarUsuariosGruposRequest, UsuariosGruposRequest } from '../request/UsuariosGruposRequest/usuariosGruposRequest';
import { MensagemDeletarUsuariosGruposResponse, RetornarCriarUsuariosGruposResponse, UsuariosGruposResponse } from '../response/usuariosGruposResponse/usuariosGruposResponse';

@Injectable({
  providedIn: 'root'
})
export class UsuariosGruposService {
  constructor(private readonly http: HttpClient) { }

  public async BuscarTodosUsuariosGruposPorId(filter: UsuariosGruposRequest): Promise<GenericResultResponse<UsuariosGruposResponse>> {
    return await firstValueFrom(
      this.http.post<GenericResultResponse<UsuariosGruposResponse>>(
        `${Environments.APIUrl}/usuariosgrupos/buscargruposporusuarioidasync`,
        filter
      )
    );
  }

  public async BuscarTodosUsuariosGruposDisponiveisPorId(filter: UsuariosGruposRequest): Promise<GenericResultResponse<UsuariosGruposResponse>> {
    return await firstValueFrom(
      this.http.post<GenericResultResponse<UsuariosGruposResponse>>(
        `${Environments.APIUrl}/usuariosgrupos/buscargruposdisponiveisporusuarioidasync`,
        filter
      )
    );
  }

  public async InserirUsuariosGrupos(filter: CriarUsuariosGruposRequest): Promise<GenericResultResponse<RetornarCriarUsuariosGruposResponse>> {
    const formData = new FormData();
    formData.append('UsuarioId', filter.usuarioId.toString());
    formData.append('GrupoId', filter.grupoId.toString());

    return await firstValueFrom(
      this.http.post<GenericResultResponse<RetornarCriarUsuariosGruposResponse>>(
        `${Environments.APIUrl}/usuariosgrupos/inserir`,
        formData
      )
    );
  }

  public async DeletarUsuariosGrupos(filter: CriarUsuariosGruposRequest): Promise<GenericResultResponse<MensagemDeletarUsuariosGruposResponse>> {
    return await firstValueFrom(
      this.http.post<GenericResultResponse<MensagemDeletarUsuariosGruposResponse>>(
        `${Environments.APIUrl}/usuariosgrupos/deletar`,
        filter
      )
    );
  }
}
