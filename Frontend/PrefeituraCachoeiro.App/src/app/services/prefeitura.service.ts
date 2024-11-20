import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Environments } from '../environments/Environments';
import { GenericResultResponse } from '../response/genericResultResponse';
import { AtualizarContratoRequest } from '../request/ContratoRequest/atualizarContratoRequest';
import { AtualizarPrefeituraResponse, PrefeituraDataResponse, PrefeituraFilter, PrefeituraResponse } from '../response/prefeituraResponse/prefeituraResponse';
import { AtualizarPrefeituraRequest } from '../request/PrefeituraRequest/AtualizarPrefeituraRequest';
import { BasePrefeituraRequest } from '../request/PrefeituraRequest/BasePrefeituraRequest';

@Injectable({
  providedIn: 'root'
})
export class PrefeituraService {
  constructor(private readonly http: HttpClient) { }

  public async BuscarPrefeitura(id: number) : Promise<GenericResultResponse<PrefeituraResponse>>{
    return await firstValueFrom(
      this.http.get<GenericResultResponse<PrefeituraResponse>>(
        `${Environments.APIUrl}prefeitura?id=${id}`
      )
    );
  }

  public async BuscarTodasPrefeituras(filter: PrefeituraFilter): Promise<GenericResultResponse<PrefeituraDataResponse>> {
    return await firstValueFrom(
      this.http.post<GenericResultResponse<PrefeituraDataResponse>>(
        `${Environments.APIUrl}/prefeitura/buscartodos`,
        filter
      )
    );
  }

  public async CriarPrefeitura(request: BasePrefeituraRequest): Promise<GenericResultResponse<AtualizarPrefeituraResponse>> {
    return await firstValueFrom(
      this.http.post<GenericResultResponse<AtualizarPrefeituraResponse>>(
        `${Environments.APIUrl}/prefeitura`,
        request
      )
    );
  }

  public async AtualizarPrefeitura(request: AtualizarPrefeituraRequest): Promise<GenericResultResponse<AtualizarPrefeituraResponse>> {
    return await firstValueFrom(
      this.http.put<GenericResultResponse<AtualizarPrefeituraResponse>>(
        `${Environments.APIUrl}/prefeitura`,
        request
      )
    );
  }

  public async DeletarPrefeitura(id: number): Promise<GenericResultResponse<string>> {
    return await firstValueFrom(
      this.http.delete<GenericResultResponse<string>>(
        `${Environments.APIUrl}/prefeitura?id=${id}`
      )
    );
  }
}
