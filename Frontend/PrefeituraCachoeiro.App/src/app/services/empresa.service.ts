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
}
