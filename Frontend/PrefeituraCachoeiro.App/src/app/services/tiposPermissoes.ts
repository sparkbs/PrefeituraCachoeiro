import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Environments } from '../environments/Environments';
import { GenericResultResponse } from '../response/genericResultResponse';
import { PermissaoResponse } from '../response/permissaoResponse/permissaoResponse';
import { TipoPermissaoResponse } from '../response/tipoPermissaoResponse/tipoPermissaoResponse';

@Injectable({
  providedIn: 'root'
})
export class TiposPermissoesService {
  constructor(private readonly http: HttpClient) { }

  public async BuscarTodasTiposPermissoes(): Promise<TipoPermissaoResponse[]> {
    return await firstValueFrom(
      this.http.get<TipoPermissaoResponse[]>(
        `${Environments.APIUrl}/tipospermissoes/buscartodos`
      )
    );
  }

}
