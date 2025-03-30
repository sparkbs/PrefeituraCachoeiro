import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { Environments } from '../environments/Environments';
import { GenericResultResponse } from '../response/genericResultResponse';
import { ContratoModel, ContratosAditivosResponse, ContratosResponse, TodosContratosResponse } from '../response/contratosResponse/todosContratosResponse';
import { CriarAditivoResponse, CriarContratoResponse, DadosContratoResponse, DocumentosRegistradosResponse } from '../response/contratosResponse/dadosContratoResponse';
import { AtualizarContratoRequest } from '../request/ContratoRequest/atualizarContratoRequest';
import { BuscarAditivosContrato, BuscarContratosRequest } from '../request/ContratoRequest/buscarContratosRequest';
import { CriarContratoRequest, salvarDocumentoAditivoRequest, salvarDocumentoContratoRequest } from '../request/ContratoRequest/criarContratoRequest';
import { VinculoProjetoContratoRequest } from '../request/ContratoRequest/vincularProjetoContrato';
import { AditivosContratoRequest } from '../request/ContratoRequest/aditivosContratoRequest';

@Injectable({
  providedIn: 'root'
})
export class ContratosService {
  constructor(private readonly http: HttpClient) { }

  public async BuscarTodosAditivos(request: BuscarAditivosContrato): Promise<GenericResultResponse<ContratosAditivosResponse[]>> {
    return await firstValueFrom(
      this.http.post<GenericResultResponse<ContratosAditivosResponse[]>>(
        `${Environments.APIUrl}/aditivos/buscartodos`,
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
      if (key === 'Arquivos' || key === 'ArquivoTemplate') {
        const arquivos = request[key];
        
        // Verifica se arquivos é um array (File[]) ou um único arquivo (File)
        if (Array.isArray(arquivos)) {
          // Se for um array de arquivos, usamos forEach
          arquivos.forEach((file: File) => {
            formData.append(key, file, file.name);
          });
        } else if (arquivos instanceof File) {
          // Se for um único arquivo, apenas adiciona diretamente
          formData.append(key, arquivos, arquivos.name);
        }
      } else {
        formData.append(key, request[key]);
      }
    });
    

    return await firstValueFrom(
      this.http.post<GenericResultResponse<CriarContratoResponse>>(
        `${Environments.APIUrl}/contratos`,
        formData
      )
    );
  }

  public async CriarAditivos(request: AditivosContratoRequest): Promise<GenericResultResponse<CriarAditivoResponse>> {
    const formData = new FormData();
    Object.keys(request).forEach(key => {
      if (key === 'Arquivos' || key === 'ArquivoTemplate') {
        const arquivos = request[key];
        
        // Verifica se arquivos é um array (File[]) ou um único arquivo (File)
        if (Array.isArray(arquivos)) {
          // Se for um array de arquivos, usamos forEach
          arquivos.forEach((file: File) => {
            formData.append(key, file, file.name);
          });
        } else if (arquivos instanceof File) {
          // Se for um único arquivo, apenas adiciona diretamente
          formData.append(key, arquivos, arquivos.name);
        }
      } else {
        formData.append(key, request[key]);
      }
    });

    return await firstValueFrom(
      this.http.post<GenericResultResponse<CriarAditivoResponse>>(
        `${Environments.APIUrl}/aditivos`,
        formData
      )
    );
  }

  public async AtualizarContrato(request: AtualizarContratoRequest): Promise<GenericResultResponse<number>> {
    const formData = new FormData();
    Object.keys(request).forEach(key => {
      if (key === 'Arquivos') {
        const arquivos = request[key];
        
        // Verifica se arquivos é um array (File[]) ou um único arquivo (File)
        if (Array.isArray(arquivos)) {
          // Se for um array de arquivos, usamos forEach
          arquivos.forEach((file: File) => {
            formData.append(key, file, file.name);
          });
        } else if (arquivos instanceof File) {
          // Se for um único arquivo, apenas adiciona diretamente
          formData.append(key, arquivos, arquivos.name);
        }
      } else {
        formData.append(key, request[key]);
      }
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

  public async DeletarAditivo(id: number): Promise<GenericResultResponse<string>> {
    return await firstValueFrom(
      this.http.delete<GenericResultResponse<string>>(
        `${Environments.APIUrl}/aditivos/${id}`
      )
    );
  }

  public async DownloadArquivoContrato(id: number) : Promise<Blob>{
    return await firstValueFrom(
      this.http.get<Blob>(
        `${Environments.APIUrl}contratos/downloadarquivocontrato/${id}`,
        {responseType: 'blob' as 'json'}
      )
    );
  }

  public async DownloadArquivoAditivo(id: number) : Promise<Blob>{
    return await firstValueFrom(
      this.http.get<Blob>(
        `${Environments.APIUrl}aditivos/downloadarquivoaditivo/${id}`,
        {responseType: 'blob' as 'json'}
      )
    );
  }

  public async AdicionarDocumentosContrato(request: salvarDocumentoContratoRequest): Promise<DocumentosRegistradosResponse> {
    const formData = new FormData();

    // Adiciona os arquivos ao FormData
    if (request.Arquivos && Array.isArray(request.Arquivos)) {
      request.Arquivos.forEach((file: File) => {
        formData.append('Arquivos', file, file.name); // Adicionando o arquivo
      });
    }
  
    // Adiciona os outros campos de dados (não arquivos)
    Object.keys(request).forEach(key => {
      if (key !== 'Arquivos') { // Ignorar os arquivos, pois já foram adicionados
        formData.append(key, request[key]);
      }
    });
    
    return await firstValueFrom(
      this.http.post<DocumentosRegistradosResponse>(
        `${Environments.APIUrl}contratos/registrardocumentos`,
        formData
      )
    );
  }

  public async AdicionarDocumentosAditivo(request: salvarDocumentoAditivoRequest): Promise<DocumentosRegistradosResponse> {
    const formData = new FormData();

    // Adiciona os arquivos ao FormData
    if (request.Arquivos && Array.isArray(request.Arquivos)) {
      request.Arquivos.forEach((file: File) => {
        formData.append('Arquivos', file, file.name); // Adicionando o arquivo
      });
    }
  
    // Adiciona os outros campos de dados (não arquivos)
    Object.keys(request).forEach(key => {
      if (key !== 'Arquivos') { // Ignorar os arquivos, pois já foram adicionados
        formData.append(key, request[key]);
      }
    });
    
    return await firstValueFrom(
      this.http.post<DocumentosRegistradosResponse>(
        `${Environments.APIUrl}aditivos/registrardocumentos`,
        formData
      )
    );
  }

  public async DeletarArquivoContrato(id: number): Promise<GenericResultResponse<string>> {
    return await firstValueFrom(
      this.http.delete<GenericResultResponse<string>>(
        `${Environments.APIUrl}/contratos/apagararquivocontrato/${id}`
      )
    );
  }

  public async DeletarArquivoAditivo(id: number): Promise<GenericResultResponse<string>> {
    return await firstValueFrom(
      this.http.delete<GenericResultResponse<string>>(
        `${Environments.APIUrl}/aditivos/apagararquivoaditivo/${id}`
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
