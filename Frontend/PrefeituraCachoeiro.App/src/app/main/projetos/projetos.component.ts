import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { EditarCriarProjetosComponent } from './editar-criar-projetos/editar-criar-projetos.component';
import { ProjetoService } from 'src/app/services/projeto.service';
import { ProjetoRequest } from 'src/app/request/ProjetoRequest/projetoRequest';
import { ProjetoResponse, ProjetosResponse } from 'src/app/response/projetoResponse/projetoResponse';
import { GenericResultResponse } from 'src/app/response/genericResultResponse';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-projetos',
  templateUrl: './projetos.component.html',
  styleUrls: ['./projetos.component.scss']
})
export class ProjetosComponent implements OnInit {
  displayedColumns: string[] = ['nomePrefeitura','nomeContrato', 'nomeProjeto', 'acoes'];
  listaProjetos: ProjetoResponse[] = [];
  dataSource = new MatTableDataSource<ProjetoResponse>(this.listaProjetos);
  projetos: ProjetosResponse;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public _projetoControllerService: ProjetoService,
    private _toastService: ToastService
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

  openEditarCriar(edicao: boolean = false, id?: number) {
    const dialogRef = this.dialog.open(EditarCriarProjetosComponent, {
      width: window.innerWidth >= 1450 ? '50%' : '50%',
      data: { edicao, id }
    }).afterClosed().subscribe(
      (res) => {
        if (res) {
          this.getAllProjects();
        }
    });
  }

  public async getAllProjects() {
    const projetoRequest: ProjetoRequest = {
      nome: '',
      pagina: 1,
      itemsPorPagina: 10000
    };

    await this._projetoControllerService.BuscarTodosProjetos(projetoRequest)
    .then((res) => {
      this.listaProjetos = (res.data);
      this.dataSource.data = this.listaProjetos;
    })
    .catch((erro) => {
      this._toastService.mensagemError('Erro ao buscar projetos!');
    });
  }

  deleteProject(id: number) {
    this._projetoControllerService.DeletarProjeto(id)
    .then((res) => {
      this._toastService.mensagemSuccess("Sucesso ao deletar projeto!");
    })
    .catch((erro) => {
      this._toastService.mensagemError('Erro ao deletar projeto!');
    });
  }
}
