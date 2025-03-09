import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { EditarCriarPerfisComponent } from '../editar-criar-perfis/editar-criar-perfis.component';
import { MatSort } from '@angular/material/sort';

export interface TablePerfis {
  id?: number;
  name: string;
  email: string;
  grupo: string;
  acoes?: string;
}

export class Perfil {
  id: number;
  name: string;
  email: string;
  grupo: string;
}

@Component({
  selector: 'app-tabela-perfis',
  templateUrl: './tabela-perfis.component.html',
  styleUrls: ['./tabela-perfis.component.scss']
})
export class TabelaPerfisComponent {
  displayedColumns: string[] = ['name', 'email', 'grupo', 'acoes'];

  perfisData: TablePerfis[] = [
    {id: 1, name: 'Nome', email: 'teste@teste.com', grupo: 'gerente', acoes: ''},
    {id: 2, name: 'Nome2', email: 'teste1@teste.com', grupo: 'usuario', acoes: ''},
    {id: 3, name: 'Nome3', email: 'teste2@teste.com', grupo: 'gerente', acoes: ''}
  ];

  dataSource = new MatTableDataSource<TablePerfis>(this.perfisData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog){}

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

  openEditarCriar(edicao: boolean = false, id?: number) {
    let perfilSend: Perfil = new Perfil();

    if (edicao) {
      var perfilTable = this.perfisData.find(res => res.id == id);
      perfilSend.id = perfilTable.id;
      perfilSend.name = perfilTable.name;
      perfilSend.email = perfilTable.email;
      perfilSend.grupo = perfilTable.grupo;
    }

    const dialogRef = this.dialog.open(EditarCriarPerfisComponent, {
      width: window.innerWidth >= 1450 ? '50%' : '50%',
      data: { edicao, perfilSend }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        return;
      }

      if (!edicao) {
        result.id = this.perfisData.length + 1;
        this.perfisData.push(result);
      }
      else {
        this.perfisData = this.perfisData.filter(item => item.id !== id);
        this.dataSource = new MatTableDataSource();
        this.perfisData.push(result);
      }

      this.dataSource = new MatTableDataSource();
      this.dataSource = new MatTableDataSource(this.perfisData);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  removePerfil(id: number) {
    this.perfisData = this.perfisData.filter(res => res.id != id);

    this.dataSource.data = this.perfisData;
  }
}
