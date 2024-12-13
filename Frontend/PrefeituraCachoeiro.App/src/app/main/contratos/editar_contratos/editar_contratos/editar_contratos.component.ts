import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AtualizarContratoRequest } from 'src/app/request/ContratoRequest/atualizarContratoRequest';
import { ContratosResponse, PrefeituraResponse } from 'src/app/response/contratosResponse/todosContratosResponse';
import { PrefeituraFilter } from 'src/app/response/prefeituraResponse/prefeituraResponse';
import { ContratosService } from 'src/app/services/contratos.service';
import { PrefeituraService } from 'src/app/services/prefeitura.service';

@Component({
  selector: 'app-editar_contratos',
  templateUrl: './editar_contratos.component.html',
  styleUrls: ['./editar_contratos.component.scss']
})
export class Editar_contratosComponent implements OnInit {
  listaPrefeitura: PrefeituraResponse[] = [];
  atualizarContrato: AtualizarContratoRequest = new AtualizarContratoRequest();

  constructor( @Inject(MAT_DIALOG_DATA) public data: ContratosResponse,
  private readonly apiPrefeitura: PrefeituraService,
   private dialogRef: MatDialogRef<Editar_contratosComponent>,
   private readonly api: ContratosService
  ) { }

  async ngOnInit() {
    this.data.dataInicio = new Date('2024-01-01'); // Converte para o formato correto
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
    this.atualizarContrato.DataContrato = this.data.dataContrato;
    this.atualizarContrato.DataInicio = this.data.dataInicio;
    this.atualizarContrato.DataTermino = this.data.dataTermino;
    this.atualizarContrato.EmpresaId = this.data.empresaId;
    this.atualizarContrato.Gerente = this.data.gerente;
    this.atualizarContrato.IdContrato = this.data.idContrato;
    this.atualizarContrato.NumeroContrato = this.data.numeroContrato;
    this.atualizarContrato.PrefeituraId = this.data.prefeituraId;
    this.atualizarContrato.TipoContratacao = this.data.tipoContratacao;
    this.atualizarContrato.Valor = this.data.valor;
    
    await this.api.AtualizarContrato(this.atualizarContrato)
    .then((result) => {
      this.dialogRef.close(result);
    });
  }
}
