import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BoletimMedicaoModel } from 'src/app/modelsBoletim/boletim-models/boletim-medicao.model';
import { BoletimDetalhadoModel } from 'src/app/modelsBoletim/boletim-models/boletim-detalhado.model';
import { BoletimProjetoModel } from 'src/app/modelsBoletim/boletim-models/boletim-projeto.model';
import { ProjetoBaseModel } from 'src/app/modelsBoletim/projeto-models/projeto-base.model';

@Injectable({
  providedIn: 'root'
})
export class BoletimService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getBoletinsMedicao(): Observable<BoletimMedicaoModel> {
    const url = `${this.apiUrl}/boletinsMedicao`;
    return this.http.get<BoletimMedicaoModel>(url);
  }

  getBuscarProjetos(): Observable<ProjetoBaseModel[]>{
    const url = `${this.apiUrl}/buscarProjetos`;
    return this.http.get<ProjetoBaseModel[]>(url);
  }

  getBoletinsPorProjetoId(projetoId: number): Observable<BoletimProjetoModel> {
    const url = `${this.apiUrl}/boletinsPorProjetoId/${projetoId}`;
    return this.http.get<BoletimProjetoModel>(url);
  }

  getBoletinsDetalhados(): Observable<BoletimDetalhadoModel> {
    const url = `${this.apiUrl}/boletinsDetalhados`;
    return this.http.get<BoletimDetalhadoModel>(url);
  }
}
