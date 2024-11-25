import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EditarCriarProjetosComponent } from './editar-criar-projetos/editar-criar-projetos.component';

export interface tableProject {
  id?: number;
  nome: string;
  contrato: string;
  prefeitura: string;
  recursos: string;
  acoes?: string;
}

const ELEMENT_DATA: tableProject[] = [
  {id: 1, nome: 'Projeto1', contrato: 'Contrato1', prefeitura: 'Prefeitura1', recursos: ''},
  {id: 2, nome: 'Projeto2', contrato: 'Contrato2', prefeitura: 'Prefeitura2', recursos: ''},
  {id: 3, nome: 'Projeto3', contrato: 'Contrato3', prefeitura: 'Prefeitura3', recursos: ''},
];

@Component({
  selector: 'app-projetos',
  templateUrl: './projetos.component.html',
  styleUrls: ['./projetos.component.scss']
})
export class ProjetosComponent {
  displayedColumns: string[] = ['nome', 'contrato', 'prefeitura', 'recursos', 'acoes'];
  dataSource = new MatTableDataSource<tableProject>(ELEMENT_DATA);

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

  openDialog(): void {
    /*const dialogRef = this.dialog.open(IncluirEditarProjetoComponent, {
      width: window.innerWidth >= 1450 ? '50%' : '50%',
      data: { }
    });*/
  }

  openEditarCriar(edicao: boolean = false) {
    const dialogRef = this.dialog.open(EditarCriarProjetosComponent, {
      width: window.innerWidth >= 1450 ? '50%' : '50%',
      data: { edicao }
    });
  }
}
