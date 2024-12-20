import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Environments } from '../environments/Environments';
import { GenericResultResponse } from '../response/genericResultResponse';
import { PermissaoResponse, RetornaIdPermissaoResponse, RetornaMensagemPermissaoResponse } from '../response/permissaoResponse/permissaoResponse';
import { PermissoesRequest } from '../request/PermissoesRequest/permissoesRequest';

@Injectable({
  providedIn: 'root'
})
export class PermissaoService {
  constructor(private readonly http: HttpClient) { }

  public async BuscarTodasPermissoes(grupoId: number): Promise<GenericResultResponse<PermissaoResponse>> {
    return await firstValueFrom(
      this.http.post<GenericResultResponse<PermissaoResponse>>(
        `${Environments.APIUrl}/permissoes/buscarpermissoesporgrupoid`,
        grupoId
      )
    );
  }

  public async CriarPermissoes(filter: PermissoesRequest): Promise<GenericResultResponse<RetornaIdPermissaoResponse>> {
    return await firstValueFrom(
      this.http.post<GenericResultResponse<RetornaIdPermissaoResponse>>(
        `${Environments.APIUrl}medicoes/inserir`,
        filter
      )
    );
  }

  public async DeletarMedicoes(filter: PermissoesRequest): Promise<GenericResultResponse<RetornaMensagemPermissaoResponse>> {
    return await firstValueFrom(
      this.http.post<GenericResultResponse<RetornaMensagemPermissaoResponse>>(
        `${Environments.APIUrl}/permissoes/deletar`,
        filter
      )
    );
  }
}
