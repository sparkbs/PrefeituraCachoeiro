import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EditarCriarProjetosComponent } from './editar-criar-projetos/editar-criar-projetos.component';
import { TabelaRecursosProjetoComponent } from './tabela-recursos-projeto/tabela-recursos-projeto.component';
import { ProjetoService } from 'src/app/services/projeto.service';
import { ProjetoRequest } from 'src/app/request/ProjetoRequest/projetoRequest';
import { ProjetoResponse, ProjetosResponse } from 'src/app/response/projetoResponse/projetoResponse';
import { GenericResultResponse } from 'src/app/response/genericResultResponse';

@Component({
  selector: 'app-projetos',
  templateUrl: './projetos.component.html',
  styleUrls: ['./projetos.component.scss']
})
export class ProjetosComponent implements OnInit {
  displayedColumns: string[] = ['nomePrefeitura','nomeContrato', 'nomeProjeto', 'recursos', 'acoes'];
  listaProjetos: ProjetoResponse[] = [];
  dataSource = new MatTableDataSource<ProjetoResponse>(this.listaProjetos);
  projetos: ProjetosResponse;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public _projetoControllerService: ProjetoService
  ){}

  ngOnInit(): void {
    this.getAllProjects();
  }

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

  openTableResources() {
    const dialogRef = this.dialog.open(TabelaRecursosProjetoComponent, {
      width: window.innerWidth >= 1450 ? '50%' : '50%',
      data: {  }
    });
  }

  public async getAllProjects() {
    const projetoRequest: ProjetoRequest = {
      nome: ''
    };

    try {
      await this._projetoControllerService.BuscarTodosProjetos(projetoRequest)
      .then((res) => {
        this.listaProjetos = (res.data);
        this.dataSource.data = this.listaProjetos;
      });

    } catch (error) {
      console.error('Erro ao buscar projetos:', error);
    }
  }
}
