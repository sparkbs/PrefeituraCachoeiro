import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Environments } from '../environments/Environments';
import { GenericResultResponse } from '../response/genericResultResponse';
import { BuscarArquivosMedicaoResponse, InserirDocumentoMedicaoResponse, MedicoesResponse, RetornoIdMedicao, RetornoReprovacaoAprovacaoResponse, TodasMedicaoProjetoResponse } from '../response/medicoesResponse/medicoesResponse';
import { AlterarMedicaoProjetoRequest, AprovarMedicoesRequest, BuscarArquivosMedicaoIdProjRequest, BuscarArquivosMedicaRequest, DadosMedicoesRequest, InserirMedicao, MedicoesRequest, RegistroDocumentosMedicoesRequest } from '../request/MedicoesRequest/medicoesRequest';

@Injectable({
  providedIn: 'root'
})
export class MedicoesService {
  constructor(private readonly http: HttpClient) { }

  public async BuscarMedicoes(id: number) : Promise<MedicoesResponse>{
    return await firstValueFrom(
      this.http.get<MedicoesResponse>(
        `${Environments.APIUrl}/medicoes/${id}`
      )
    );
  }

  public async BuscarTodasMedicoesOld(filter: MedicoesRequest): Promise<TodasMedicaoProjetoResponse> {
    return await firstValueFrom(
      this.http.post<TodasMedicaoProjetoResponse>(
        `${Environments.APIUrl}/medicoes/buscartodos`,
        filter
      )
    );
  }

  public async BuscarTodasMedicoes(filter: MedicoesRequest): Promise<TodasMedicaoProjetoResponse> {
    return await firstValueFrom(
      this.http.post<TodasMedicaoProjetoResponse>(
        `${Environments.APIUrl}/medicoes/buscartodosnovo`,
        filter
      )
    );
  }

  public async CriarMedicoes(filter: InserirMedicao): Promise<RetornoIdMedicao> {
    return await firstValueFrom(
      this.http.post<RetornoIdMedicao>(
        `${Environments.APIUrl}medicoes/inserir`,
        filter
      )
    );
  }

  public async AprovarMedicoes(filter: AprovarMedicoesRequest): Promise<RetornoReprovacaoAprovacaoResponse> {
    const formData = new FormData();

    // Adiciona os arquivos ao FormData
    if (filter.Arquivos && Array.isArray(filter.Arquivos)) {
      filter.Arquivos.forEach((file: File) => {
        formData.append('Arquivos', file, file.name); // Adicionando o arquivo
      });
    }
  
    // Adiciona os outros campos de dados (não arquivos)
    Object.keys(filter).forEach(key => {
      if (key !== 'Arquivos') { // Ignorar os arquivos, pois já foram adicionados
        formData.append(key, filter[key]);
      }
    });
    
    return await firstValueFrom(
      this.http.post<RetornoReprovacaoAprovacaoResponse>(
        `${Environments.APIUrl}medicoes/aprovar`,
        formData
      )
    );
  }

  public async ReprovarMedicoes(filter: DadosMedicoesRequest): Promise<RetornoReprovacaoAprovacaoResponse> {
    const formData = new FormData();
    Object.keys(filter).forEach(key => {
      formData.append(key, filter[key]);
    });

    return await firstValueFrom(
      this.http.post<RetornoReprovacaoAprovacaoResponse>(
        `${Environments.APIUrl}medicoes/reprovar`,
        formData
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

  public async RegistrarDocumentosMedicoes(filter: RegistroDocumentosMedicoesRequest): Promise<InserirDocumentoMedicaoResponse> {
    const formData = new FormData();
    Object.keys(filter).forEach(key => {
      formData.append(key, filter[key]);
    });

    return await firstValueFrom(
      this.http.post<InserirDocumentoMedicaoResponse>(
        `${Environments.APIUrl}medicoes/registrardocumentos`,
        formData
      )
    );
  }

  public async DeletarArquivoMedicao(id: number): Promise<GenericResultResponse<string>> {
    return await firstValueFrom(
      this.http.delete<GenericResultResponse<string>>(
        `${Environments.APIUrl}medicoes/apagararquivomedicao/${id}`
      )
    );
  }

  public async BuscarArquivosMedicoes(arquivosMedicoesFilter: BuscarArquivosMedicaRequest) : Promise<GenericResultResponse<BuscarArquivosMedicaoResponse[]>>{
    const formData = new FormData();
    Object.keys(arquivosMedicoesFilter).forEach(key => {
      formData.append(key, arquivosMedicoesFilter[key]);
    });

    return await firstValueFrom(
      this.http.post<GenericResultResponse<BuscarArquivosMedicaoResponse[]>>(
        `${Environments.APIUrl}medicoes/buscararquivosmedicao`,
        formData
      )
    );
  }

  public async DownloadArquivoMedicao(id: number) : Promise<Blob>{
    return await firstValueFrom(
      this.http.get<Blob>(
        `${Environments.APIUrl}medicoes/downloadarquivomedicao/${id}`,
        {responseType: 'blob' as 'json'}
      )
    );
  }

  public async EnviarMedicaoCliente(IdMedicoesProjeto: BuscarArquivosMedicaoIdProjRequest) : Promise<RetornoReprovacaoAprovacaoResponse>{
    const formData = new FormData();
    Object.keys(IdMedicoesProjeto).forEach(key => {
      formData.append(key, IdMedicoesProjeto[key]);
    });

    return await firstValueFrom(
      this.http.post<RetornoReprovacaoAprovacaoResponse>(
        `${Environments.APIUrl}medicoes/enviarcliente`,
        formData
      )
    );
  }

  public async DeletarMedicao(id: number): Promise<GenericResultResponse<string>> {
    return await firstValueFrom(
      this.http.delete<GenericResultResponse<string>>(
        `${Environments.APIUrl}medicoes/${id}`
      )
    );
  }
}
