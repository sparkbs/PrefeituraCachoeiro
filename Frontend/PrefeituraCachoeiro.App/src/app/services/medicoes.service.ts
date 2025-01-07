import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Environments } from '../environments/Environments';
import { GenericResultResponse } from '../response/genericResultResponse';
import { MedicoesResponse, RetornoIdMedicao, RetornoReprovacaoAprovacaoResponse, TodasMedicaoProjetoResponse } from '../response/medicoesResponse/medicoesResponse';
import { AlterarMedicaoProjetoRequest, AprovarMedicoesRequest, DadosMedicoesRequest, InserirMedicao, MedicoesRequest } from '../request/MedicoesRequest/medicoesRequest';

@Injectable({
  providedIn: 'root'
})
export class MedicoesService {
  constructor(private readonly http: HttpClient) { }

  public async BuscarMedicoes(id: number) : Promise<MedicoesResponse>{
    return await firstValueFrom(
      this.http.get<MedicoesResponse>(
        `${Environments.APIUrl}/medicoes?id=${id}`
      )
    );
  }

  public async BuscarTodasMedicoes(filter: MedicoesRequest): Promise<TodasMedicaoProjetoResponse> {
    return await firstValueFrom(
      this.http.post<TodasMedicaoProjetoResponse>(
        `${Environments.APIUrl}/medicoes/buscartodos`,
        filter
      )
    );
  }

  public async CriarMedicoes(filter: InserirMedicao): Promise<GenericResultResponse<RetornoIdMedicao>> {
    return await firstValueFrom(
      this.http.post<GenericResultResponse<RetornoIdMedicao>>(
        `${Environments.APIUrl}medicoes/inserir`,
        filter
      )
    );
  }

  public async AprovarMedicoes(filter: AprovarMedicoesRequest): Promise<RetornoReprovacaoAprovacaoResponse> {
    const formData = new FormData();
    Object.keys(filter).forEach(key => {
      formData.append(key, filter[key]);
    });
    
    return await firstValueFrom(
      this.http.post<RetornoReprovacaoAprovacaoResponse>(
        `${Environments.APIUrl}/medicoes/aprovar`,
        formData
      )
    );
  }

  public async ReprovarMedicoes(filter: DadosMedicoesRequest): Promise<GenericResultResponse<RetornoReprovacaoAprovacaoResponse>> {
    return await firstValueFrom(
      this.http.post<GenericResultResponse<RetornoReprovacaoAprovacaoResponse>>(
        `${Environments.APIUrl}medicoes/reprovar`,
        filter
      )
    );
  }

  public async AlterarMedicoes(filter: AlterarMedicaoProjetoRequest): Promise<GenericResultResponse<RetornoIdMedicao>> {
    return await firstValueFrom(
      this.http.put<GenericResultResponse<RetornoIdMedicao>>(
        `${Environments.APIUrl}/medicoes/alterar`,
        filter
      )
    );
  }
}
