import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EditarCriarBaseDadosComponent } from '../editar-criar-base-dados/editar-criar-base-dados.component';

export interface PeriodicElement {
  nome: string;
  origem: string;
  unidade: number;
  quantidade: string;
  valorSemBdi: number;
  valorComBdi: number;
  valor: number;
  acoes: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { nome: 'Projetista Junior', origem: 'SUDECAP', unidade: 2.880, quantidade: 'H', valorSemBdi: 22.7, valorComBdi: 28.55, valor: 82.224, acoes: '' },
  { nome: 'Técnico Sênior', origem: 'SUDECAP', unidade: 480, quantidade: 'H', valorSemBdi: 28.26, valorComBdi: 35.53, valor: 17.054, acoes: '' },
  { nome: 'Projeto Elétrico', origem: 'SUDECAP', unidade: 100, quantidade: 'A1', valorSemBdi: 1.245, valorComBdi: 1.566, valor: 156.657, acoes: '' },
];

@Component({
  selector: 'app-tabela-base-dados',
  templateUrl: './tabela-base-dados.component.html',
  styleUrls: ['./tabela-base-dados.component.scss']
})
export class TabelaBaseDadosComponent {
  displayedColumns: string[] = ['nome', 'origem', 'unidade', 'quantidade', 'valorSemBdi', 'valorComBdi', 'valor', 'acoes'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog){}

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openEditarCriar(edicao: boolean = false) {
    const dialogRef = this.dialog.open(EditarCriarBaseDadosComponent, {
      width: window.innerWidth >= 1450 ? '50%' : '50%',
      data: { edicao }
    });
  }
}
