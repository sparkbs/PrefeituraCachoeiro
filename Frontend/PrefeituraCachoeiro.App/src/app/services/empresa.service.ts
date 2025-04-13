import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Environments } from '../environments/Environments';
import { GenericResultResponse } from '../response/genericResultResponse';
import { AtualizarContratoRequest } from '../request/ContratoRequest/atualizarContratoRequest';
import { AtualizarPrefeituraResponse, PrefeituraDataResponse, PrefeituraFilter, PrefeituraResponse } from '../response/prefeituraResponse/prefeituraResponse';
import { AtualizarPrefeituraRequest } from '../request/PrefeituraRequest/AtualizarPrefeituraRequest';
import { BasePrefeituraRequest } from '../request/PrefeituraRequest/BasePrefeituraRequest';
import { EmpresaDataResponse, EmpresaResponse } from '../response/contratosResponse/todosContratosResponse';
import { BaseEmpresaRequest } from '../request/EmpresaRequest/BaseEmpresaRequest';
import { AtualizarEmpresaRequest } from '../request/EmpresaRequest/AtualizarEmpresaRequest';
import { AtualizarEmpresaResponse } from '../response/empresaResponse/empresaResponse';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  constructor(private readonly http: HttpClient) { }

  public async BuscarTodasEmpresas(filter: PrefeituraFilter): Promise<EmpresaDataResponse> {
    return await firstValueFrom(
      this.http.post<EmpresaDataResponse>(
        `${Environments.APIUrl}/empresa/buscartodos`,
        filter
      )
    );
  }

  public async BuscarEmpresa(id: number) : Promise<EmpresaResponse>{
    return await firstValueFrom(
      this.http.get<EmpresaResponse>(
        `${Environments.APIUrl}/empresa/${id}`
      )
    );
  }

  public async DeletarEmpresa(id: number): Promise<GenericResultResponse<string>> {
    return await firstValueFrom(
      this.http.delete<GenericResultResponse<string>>(
        `${Environments.APIUrl}/empresa/${id}`
      )
    );
  }

  public async CriarEmpresa(request: BaseEmpresaRequest): Promise<GenericResultResponse<AtualizarEmpresaResponse>> {
    const formData = new FormData();
    console.log(request);
    formData.append('Nome', request.Nome);

    if (request.Logo) {
      formData.append('Logo', request.Logo);
    }
    console.log(formData);

    return await firstValueFrom(
      this.http.post<GenericResultResponse<AtualizarEmpresaResponse>>(
        `${Environments.APIUrl}/empresa`,
        formData
      )
    );
  }

  public async AtualizarEmpresa(request: AtualizarEmpresaRequest): Promise<GenericResultResponse<AtualizarEmpresaResponse>> {
    const formData = new FormData();
    formData.append('Nome', request.Nome);
    formData.append('EmpresaId', request.EmpresaId.toString());

    if (request.Logo) {
      formData.append('Logo', request.Logo);
    }

    return await firstValueFrom(
      this.http.put<GenericResultResponse<AtualizarEmpresaResponse>>(
        `${Environments.APIUrl}/empresa`,
        formData
      )
    );
  }
}
