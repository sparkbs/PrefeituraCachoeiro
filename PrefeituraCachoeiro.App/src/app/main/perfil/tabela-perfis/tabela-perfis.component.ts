import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EditarCriarPerfisComponent } from '../editar-criar-perfis/editar-criar-perfis.component';
import { MatDialog } from '@angular/material/dialog';

export interface PeriodicElement {
  name: string;
  email: string;
  grupo: string;
  acoes: string
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'Nome', email: 'teste@teste.com', grupo: 'gerente', acoes: ''},
  {name: 'Nome2', email: 'teste1@teste.com', grupo: 'usuario', acoes: ''},
  {name: 'Nome3', email: 'teste2@teste.com', grupo: 'gerente', acoes: ''}
];

@Component({
  selector: 'app-tabela-perfis',
  templateUrl: './tabela-perfis.component.html',
  styleUrls: ['./tabela-perfis.component.scss']
})
export class TabelaPerfisComponent {
  displayedColumns: string[] = ['name', 'email', 'grupo', 'acoes'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
    const dialogRef = this.dialog.open(EditarCriarPerfisComponent, {
      width: window.innerWidth >= 1450 ? '50%' : '50%',
      data: { edicao }
    });
  }
}
