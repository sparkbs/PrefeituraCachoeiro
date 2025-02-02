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

  public async BuscarPrefeitura(id: number) : Promise<PrefeituraResponse>{
    return await firstValueFrom(
      this.http.get<PrefeituraResponse>(
        `${Environments.APIUrl}/prefeitura/${id}`
      )
    );
  }

  public async BuscarTodasPrefeituras(filter: PrefeituraFilter): Promise<PrefeituraDataResponse> {
    return await firstValueFrom(
      this.http.post<PrefeituraDataResponse>(
        `${Environments.APIUrl}/prefeitura/buscartodos`,
        filter
      )
    );
  }

  public async CriarPrefeitura(request: BasePrefeituraRequest): Promise<GenericResultResponse<AtualizarPrefeituraResponse>> {
    const formData = new FormData();
    formData.append('Nome', request.Nome);

    if (request.Logo) {
      formData.append('Logo', request.Logo);
    }

    return await firstValueFrom(
      this.http.post<GenericResultResponse<AtualizarPrefeituraResponse>>(
        `${Environments.APIUrl}/prefeitura`,
        formData
      )
    );
  }

  public async AtualizarPrefeitura(request: AtualizarPrefeituraRequest): Promise<GenericResultResponse<AtualizarPrefeituraResponse>> {
    const formData = new FormData();
    formData.append('Nome', request.Nome);
    formData.append('IdPrefeitura', request.IdPrefeitura.toString());

    if (request.Logo) {
      formData.append('Logo', request.Logo);
    }

    return await firstValueFrom(
      this.http.put<GenericResultResponse<AtualizarPrefeituraResponse>>(
        `${Environments.APIUrl}/prefeitura`,
        formData
      )
    );
  }

  public async DeletarPrefeitura(id: number): Promise<GenericResultResponse<string>> {
    return await firstValueFrom(
      this.http.delete<GenericResultResponse<string>>(
        `${Environments.APIUrl}/prefeitura/${id}`
      )
    );
  }
}
