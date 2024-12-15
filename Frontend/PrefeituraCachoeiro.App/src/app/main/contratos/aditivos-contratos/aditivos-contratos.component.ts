import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';

export interface ItemAditivos {
  tipoAditivo: string;
  planilha: string;
  valor:string;
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
    { tipoAditivo: 'Prazo', planilha: 'planilha.xlsx', valor: 'R$1.232,90', dataAssinatura: '10/02/2020', validadeAditivo: '10/09/2020' ,acoes: ''},
    { tipoAditivo: 'Valor', planilha: 'planilha2.xlsx',  valor: 'R$2.232,10',dataAssinatura: '20/05/2022', validadeAditivo: '20/10/2022' ,acoes: ''},
    { tipoAditivo: 'Prazo', planilha: 'planilha3.xlsx',  valor: 'R$9.232,90',dataAssinatura: '11/12/2021', validadeAditivo: '11/09/2021' ,acoes: ''},
    { tipoAditivo: 'Valor', planilha: 'planilha4.xlsx',  valor: 'R$5.232,90',dataAssinatura: '22/05/2021', validadeAditivo: '20/05/2022' ,acoes: ''},
  ]
  displayedColumns: string[] = ['tipoAditivo', 'planilha', 'valor','dataAssinatura', 'validadeAditivo','acoes'];
  dataSource: MatTableDataSource<ItemAditivos>;
  valorAditivo: string;

  constructor() {
    this.dataSource = new MatTableDataSource(this.lista);
   }

  ngOnInit() {
  }

  deletarAditivo(row: ItemAditivos){
    this.lista = this.lista.filter(item => item != row);
    this.dataSource.data = this.lista;
  }

  handleKeyDown(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    
    if (!allowedKeys.includes(event.key) && (event.key < '0' || event.key > '9')) {
      event.preventDefault(); // Impede a entrada de letras
    }
  }
  
  formatCurrency(event: any): void { 
    let value = event.target.value.toString();
    value = value.replace(/\D/g, ''); 
    if (value === '') {
      this.valorAditivo = ''; // Ou você pode definir um valor padrão
      return;
    }
    value = (parseInt(value) || 0).toString(); 
    value = value.padStart(3, '0'); 
    value = value.slice(0, -2) + ',' + value.slice(-2); 
    value = value.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); 
    value = 'R$ ' + value; 
    this.valorAditivo = value; 
  }

}
