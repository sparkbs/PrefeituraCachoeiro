import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Environments } from '../environments/Environments';
import { GenericResultResponse } from '../response/genericResultResponse';
import { TodosContratosResponse } from '../response/contratosResponse/todosContratosResponse';
import { DadosContratoResponse } from '../response/contratosResponse/dadosContratoResponse';
import { AtualizarContratoRequest } from '../request/ContratoRequest/atualizarContratoRequest';
import { BuscarContratosRequest } from '../request/ContratoRequest/buscarContratosRequest';

@Injectable({
  providedIn: 'root'
})
export class ContratosService {
  constructor(private readonly http: HttpClient) { }

  public async BuscarTodosContratos(request: BuscarContratosRequest): Promise<GenericResultResponse<TodosContratosResponse>> {
    return await firstValueFrom(
      this.http.post<GenericResultResponse<TodosContratosResponse>>(
        `${Environments.APIUrl}/contratos/buscartodos`,
        request
      )
    );
  }

  public async BuscarContrato(id: number) : Promise<GenericResultResponse<DadosContratoResponse>>{
    return await firstValueFrom(
      this.http.get<GenericResultResponse<DadosContratoResponse>>(
        `${Environments.APIUrl}contratos?id=${id}`
      )
    );
  }

  public async CriarContrato(id: number, dataContrato: string): Promise<GenericResultResponse<number>> {
    return await firstValueFrom(
      this.http.post<GenericResultResponse<number>>(
        `${Environments.APIUrl}/contratos`,
        {
          IdProjeto: id,
          DataContrato: dataContrato
        }
      )
    );
  }

  public async AtualizarContrato(request: AtualizarContratoRequest): Promise<GenericResultResponse<number>> {
    return await firstValueFrom(
      this.http.put<GenericResultResponse<number>>(
        `${Environments.APIUrl}/contratos`,
        request
      )
    );
  }
}
