import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Item } from '../contratos.component';
import { PrefeituraFilter, PrefeituraResponse } from 'src/app/response/prefeituraResponse/prefeituraResponse';
import { PrefeituraService } from 'src/app/services/prefeitura.service';
import { CriarContratoRequest } from 'src/app/request/ContratoRequest/criarContratoRequest';
import { ContratosService } from 'src/app/services/contratos.service';

@Component({
  selector: 'app-editar_criar_contratos',
  templateUrl: './editar_criar_contratos.component.html',
  styleUrls: ['./editar_criar_contratos.component.scss']
})
export class Editar_criar_contratosComponent implements OnInit {
  listaPrefeitura: PrefeituraResponse[] = [];
  criarContrato: CriarContratoRequest = new CriarContratoRequest();

  constructor(@Inject(MAT_DIALOG_DATA) public data: Item, 
  private dialogRef: MatDialogRef<Editar_criar_contratosComponent>,
  private readonly apiPrefeitura: PrefeituraService,
  private readonly api: ContratosService
) { 
  }

  async ngOnInit() {
    await this.buscarListaPrefeituras();
  }

  async buscarListaPrefeituras(){
    var prefeituraFilter : PrefeituraFilter = new PrefeituraFilter();
    prefeituraFilter.nome = "";
    prefeituraFilter.itemsPorPagina = 10;
    prefeituraFilter.pagina = 1;
    await this.apiPrefeitura.BuscarTodasPrefeituras(prefeituraFilter)
    .then((result) => {
      this.listaPrefeitura = result.data;
    });
  }

  async salvar(){
    this.criarContrato.EmpresaId = 1;
    this.criarContrato.IdProjeto = 4;

    await this.api.CriarContrato(this.criarContrato)
    .then((result) => {
      this.dialogRef.close(result);
    });
  }
}
