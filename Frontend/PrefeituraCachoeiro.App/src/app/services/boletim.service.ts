import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from '../environments/Environments';
import { firstValueFrom } from 'rxjs';
import { BoletimProjetoModel } from '../modelsBoletim/boletim-models/boletim-projeto.model';
import { BuscarBoletimProjetoRequest } from '../request/BoletimRequest/boletimProjetoRequest';
import { BoletimMedicaoDetalhadoResponse, BoletimDetalhadoResponse, BoletimResponse } from '../response/BoletimResponse/boletimResponse';
import { BuscarBoletimDetalhadoRequest } from '../request/BoletimRequest/boletimDetalhadoRequest';

@Injectable({
  providedIn: 'root'
})
export class BoletimService {

  constructor(private readonly http: HttpClient) { }

  public async BuscarBoletimProjeto(projetoRequest: BuscarBoletimProjetoRequest): Promise<BoletimResponse>{
      return await firstValueFrom(
        this.http.post<BoletimResponse>(
          `${Environments.APIUrl}/boletins/buscarboletimprojeto`,
          projetoRequest
        )
      );
  }
  
  //Não utilizado atualmente
  public async BuscarBoletimDetalhado(medicaoRequest: BuscarBoletimDetalhadoRequest): Promise<BoletimDetalhadoResponse> {
    return await firstValueFrom(
      this.http.post<BoletimDetalhadoResponse>(
        `${Environments.APIUrl}/boletins/buscarboletimmedicao`,
        medicaoRequest
      )
    );
  }

  public async BuscarBoletimGeral(medicaoRequest: BuscarBoletimDetalhadoRequest): Promise<BoletimMedicaoDetalhadoResponse> {
    return await firstValueFrom(
      this.http.post<BoletimMedicaoDetalhadoResponse>(
        `${Environments.APIUrl}/boletins/buscarboletimmedicaodetalhado`,
        medicaoRequest
      )
    );
  }
}
