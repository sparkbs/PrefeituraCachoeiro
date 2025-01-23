import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Environments } from '../environments/Environments';
import { GenericResultResponse } from '../response/genericResultResponse';
import { ContratoModel, ContratosResponse, TodosContratosResponse } from '../response/contratosResponse/todosContratosResponse';
import { CriarContratoResponse, DadosContratoResponse } from '../response/contratosResponse/dadosContratoResponse';
import { AtualizarContratoRequest } from '../request/ContratoRequest/atualizarContratoRequest';
import { BuscarAditivosContrato, BuscarContratosRequest } from '../request/ContratoRequest/buscarContratosRequest';
import { CriarContratoRequest } from '../request/ContratoRequest/criarContratoRequest';
import { VinculoProjetoContratoRequest } from '../request/ContratoRequest/vincularProjetoContrato';

@Injectable({
  providedIn: 'root'
})
export class ContratosService {
  constructor(private readonly http: HttpClient) { }

  public async BuscarTodosAditivos(request: BuscarAditivosContrato): Promise<ContratosResponse[]> {
    console.log(request);
    return await firstValueFrom(
      this.http.post<ContratosResponse[]>(
        `${Environments.APIUrl}/contratos/buscartodosaditivos`,
        request
      )
    );
  }

  public async BuscarTodosContratos(request: BuscarContratosRequest): Promise<GenericResultResponse<ContratosResponse[]>> {
    return await firstValueFrom(
      this.http.post<GenericResultResponse<ContratosResponse[]>>(
        `${Environments.APIUrl}/contratos/buscartodos`,
        request
      )
    );
  }
  // Novo recebimento de contrato
  public async BuscarTodosContratosNew(request: BuscarContratosRequest): Promise<GenericResultResponse<ContratoModel[]>> {
    return await firstValueFrom(
      this.http.post<GenericResultResponse<ContratoModel[]>>(
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

  public async CriarContrato(request: CriarContratoRequest): Promise<GenericResultResponse<CriarContratoResponse>> {
    const formData = new FormData();
    Object.keys(request).forEach(key => {
      formData.append(key, request[key]);
    });

    return await firstValueFrom(
      this.http.post<GenericResultResponse<CriarContratoResponse>>(
        `${Environments.APIUrl}/contratos`,
        formData
      )
    );
  }

  public async AtualizarContrato(request: AtualizarContratoRequest): Promise<GenericResultResponse<number>> {
    const formData = new FormData();
    Object.keys(request).forEach(key => {
      formData.append(key, request[key]);
    });

    return await firstValueFrom(
      this.http.put<GenericResultResponse<number>>(
        `${Environments.APIUrl}/contratos`,
        formData
      )
    );
  }

  public async DeletarContrato(id: number): Promise<GenericResultResponse<string>> {
    return await firstValueFrom(
      this.http.delete<GenericResultResponse<string>>(
        `${Environments.APIUrl}/contratos/${id}`
      )
    );
  }

  public async AdicionarProjetoContrato(vinculoProjContrato: VinculoProjetoContratoRequest): Promise<GenericResultResponse<string>> {
    return await firstValueFrom(
      this.http.post<GenericResultResponse<string>>(
        `${Environments.APIUrl}/contratos/adicionarprojetocontrato`,
        vinculoProjContrato
      )
    );
  }

  public async removerProjetoContrato(vinculoProjContrato: VinculoProjetoContratoRequest): Promise<GenericResultResponse<string>> {
    return await firstValueFrom(
      this.http.delete<GenericResultResponse<string>>(
        `${Environments.APIUrl}/contratos/removerprojetocontrato`,
        {
          body: vinculoProjContrato,
        }
      )
    );
  }
}
