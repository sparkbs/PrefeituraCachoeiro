import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

export interface ItemAditivos {
  tipoAditivo: string;
  planilha: string;
  dataAssinatura: string;
  validadeAditivo: string;
  acoes: string;
}

@Component({
  selector: 'app-aditivos-contratos',
  templateUrl: './aditivos-contratos.component.html',
  styleUrls: ['./aditivos-contratos.component.scss']
})
export class AditivosContratosComponent implements OnInit {
  lista: ItemAditivos[] = [
    { tipoAditivo: 'Prazo', planilha: 'planilha.xlsx', dataAssinatura: '10/02/2020', validadeAditivo: '10/09/2020' ,acoes: ''},
    { tipoAditivo: 'Valor', planilha: 'planilha2.xlsx', dataAssinatura: '20/05/2022', validadeAditivo: '20/10/2022' ,acoes: ''},
    { tipoAditivo: 'Prazo', planilha: 'planilha3.xlsx', dataAssinatura: '11/12/2021', validadeAditivo: '11/09/2021' ,acoes: ''},
    { tipoAditivo: 'Valor', planilha: 'planilha4.xlsx', dataAssinatura: '22/05/2021', validadeAditivo: '20/05/2022' ,acoes: ''},
  ]
  displayedColumns: string[] = ['tipoAditivo', 'planilha', 'dataAssinatura', 'validadeAditivo','acoes'];
  dataSource: MatTableDataSource<ItemAditivos>;

  constructor() {
    this.dataSource = new MatTableDataSource(this.lista);
   }

  ngOnInit() {
  }

  deletarAditivo(row: ItemAditivos){
    this.lista = this.lista.filter(item => item != row);
    this.dataSource.data = this.lista;
  }

}
