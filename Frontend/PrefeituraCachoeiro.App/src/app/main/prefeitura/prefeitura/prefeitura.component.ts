import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Editar_criar_prefeituraComponent } from '../editar_criar_prefeitura/editar_criar_prefeitura.component';

export interface ItemPrefeitura {
  id: number;
  nomePrefeitura: string;
  criadoEm: string;
  acoes: string;
}

@Component({
  selector: 'app-prefeitura',
  templateUrl: './prefeitura.component.html',
  styleUrls: ['./prefeitura.component.scss']
})
export class PrefeituraComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  lista: ItemPrefeitura[] = [
    { id: 1,nomePrefeitura: 'Cachoeiro', criadoEm: '25/03/2020 ',acoes: ''},
    { id:2, nomePrefeitura: 'BH',  criadoEm: '25/08/2022',acoes: '' },
    { id: 3,nomePrefeitura: 'Teste',  criadoEm: '25/03/2021',acoes: '' }
  ]
  displayedColumns: string[] = ['nomePrefeitura', 'criadoEm','acoes'];
  
  dataSource: MatTableDataSource<ItemPrefeitura>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() { 
    this.dataSource = new MatTableDataSource(this.lista);    
  }

  ngOnInit() {
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

  deletePrefeitura(id: number){
    this.lista = this.lista.filter(item => item.id !== id);
    this.dataSource.data = this.lista;
  }

  openDialog() {
    const dialogRef = this.dialog.open(Editar_criar_prefeituraComponent);

    dialogRef.afterClosed().subscribe(result => {
      result.id = this.lista.length + 1;
      this.lista.push(result);
      this.dataSource = new MatTableDataSource();
      this.dataSource = new MatTableDataSource(this.lista);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });

  }

  async editPrefeitura(row: ItemPrefeitura){
    const dialogRef = this.dialog.open(Editar_criar_prefeituraComponent,{
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
