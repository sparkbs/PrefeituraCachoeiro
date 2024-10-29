import { AfterViewInit, Component, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Editar_criar_contratosComponent } from './editar_criar_contratos/editar_criar_contratos.component';

export interface Item {
  id:number;
  nomePrefeitura: string;
  dataInicioEFim: string;
  consorcio: string;
  gerente: string;
  valorContrato: number;
  tipoContratacao: string;
  acoes: string;
}

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.scss']
})
export class ContratosComponent implements AfterViewInit {
  readonly dialog = inject(MatDialog);

  lista: Item[] = [
    { id: 1,nomePrefeitura: 'Cachoeiro', dataInicioEFim: '25/03/2020 até 25/03/2022', consorcio: 'teste 1', gerente: 'João', valorContrato:20.000, tipoContratacao:'Adesão' ,acoes: ''},
    { id:2, nomePrefeitura: 'BH',  dataInicioEFim: '22/08/2020 até 25/08/2022', consorcio: 'teste 2', gerente: 'Maria', valorContrato:100.000, tipoContratacao:'Licitação',acoes: '' },
    { id: 3,nomePrefeitura: 'Teste',  dataInicioEFim: '25/03/2019 até 25/03/2021', consorcio: 'teste 3', gerente: 'Pedro', valorContrato:200.000, tipoContratacao:'Adesão',acoes: '' }
  ]
  displayedColumns: string[] = ['nomePrefeitura', 'dataInicioEFim', 'consorcio', 'gerente','valorContrato','tipoContratacao','acoes'];
  dataSource: MatTableDataSource<Item>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.dataSource = new MatTableDataSource(this.lista);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteContrato(id: number){
    this.lista = this.lista.filter(item => item.id !== id);
    this.dataSource.data = this.lista;
  }

  openDialog() {
    const dialogRef = this.dialog.open(Editar_criar_contratosComponent);

    dialogRef.afterClosed().subscribe(result => {
      result.id = this.lista.length + 1;
      this.lista.push(result);
      this.dataSource = new MatTableDataSource();
      this.dataSource = new MatTableDataSource(this.lista);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  editContrato(row: Item){
    const dialogRef = this.dialog.open(Editar_criar_contratosComponent,{
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      this.lista = this.lista.filter(item => item.id !== result.id);
      this.dataSource = new MatTableDataSource();
      this.lista.push(result);
      this.dataSource = new MatTableDataSource(this.lista);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;    
    });
  }
}
