import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ItemContrato, ItemMedicao, MedicoesResponse } from 'src/app/response/medicoesResponse/medicoesResponse';

@Component({
  selector: 'app-resumoMedicao',
  templateUrl: './resumoMedicao.component.html',
  styleUrls: ['./resumoMedicao.component.scss']
})
export class ResumoMedicaoComponent implements OnInit {
  dataSource: MatTableDataSource<ItemContrato>;
  displayedColumns: string[] = ['item', 'codigo', 'origem', 'item/qtd', 'valor(s)cBdi', 'valorTotal/bdi'];
  itemsToLoad : MedicoesResponse;
  constructor(@Inject(MAT_DIALOG_DATA) public data: MedicoesResponse) { 
    
    // Tente inicializar com dados brutos
    this.dataSource = new MatTableDataSource(this.data.contratos.items);
  }

  ngOnInit() {
    this.itemsToLoad = this.data;

    this.dataSource.data = this.itemsToLoad.contratos.items;
  }

  formatToCurrency(valor: number): string {
    // Formatar o valor como string com 2 casas decimais
    let valorFormatado = valor.toFixed(2);  // 2 casas decimais

    // Substituir o ponto (.) por vírgula para separar os decimais
    valorFormatado = valorFormatado.replace('.', ',');

    // Adicionar o separador de milhar (ponto) para valores maiores que 1.000
    valorFormatado = valorFormatado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    // Adicionar o prefixo 'R$'
    return 'R$ ' + valorFormatado;
  }
}