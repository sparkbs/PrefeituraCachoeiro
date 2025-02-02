import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environments } from '../environments/Environments';
import { firstValueFrom } from 'rxjs';
import { BoletimProjetoModel } from '../modelsBoletim/boletim-models/boletim-projeto.model';
import { BuscarBoletimProjetoRequest } from '../request/BoletimRequest/boletimProjetoRequest';
import { BoletimMedicaoResponse, BoletimResponse } from '../response/BoletimResponse/boletimResponse';
import { BuscarBoletimMedicaoRequest } from '../request/BoletimRequest/boletimMedicaoRequest';

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

  public async BuscarBoletimMedicao(medicaoRequest: BuscarBoletimMedicaoRequest): Promise<BoletimMedicaoResponse> {
    return await firstValueFrom(
      this.http.post<BoletimMedicaoResponse>(
        `${Environments.APIUrl}/boletins/buscarboletimmedicao`,
        medicaoRequest
      )
    );
  }
}
