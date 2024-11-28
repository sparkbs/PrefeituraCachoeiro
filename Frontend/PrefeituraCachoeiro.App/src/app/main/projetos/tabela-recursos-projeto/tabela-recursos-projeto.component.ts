import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface tableRecursos {
  nome: string;
  quantidade: number;
  valor: number;
}

const recursosData: tableRecursos[] = [
  {nome: 'Projeto de GLP', quantidade: 5, valor: 23 },
  {nome: 'Projeto Elétrico', quantidade: 10, valor: 34 },
  {nome: 'Chapa de metal', quantidade: 7, valor: 15 },
];

@Component({
  selector: 'app-tabela-recursos-projeto',
  templateUrl: './tabela-recursos-projeto.component.html',
  styleUrls: ['./tabela-recursos-projeto.component.scss']
})
export class TabelaRecursosProjetoComponent {
  displayedColumns: string[] = ['nome', 'quantidade', 'valor'];
  dataSource = new MatTableDataSource<tableRecursos>(recursosData);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialogRef: MatDialogRef<TabelaRecursosProjetoComponent>) {}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
}
