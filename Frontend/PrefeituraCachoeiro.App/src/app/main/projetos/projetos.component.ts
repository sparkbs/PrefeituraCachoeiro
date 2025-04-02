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
import { PrefeituraFilter, PrefeituraResponse } from 'src/app/response/prefeituraResponse/prefeituraResponse';
import { PrefeituraService } from 'src/app/services/prefeitura.service';
import { ContratosService } from 'src/app/services/contratos.service';
import { VinculoProjetoContratoRequest } from 'src/app/request/ContratoRequest/vincularProjetoContrato';
import { ConfirmaExclusaoComponent } from 'src/app/shared/confirma-exclusao/confirma-exclusao.component';

@Component({
  selector: 'app-projetos',
  templateUrl: './projetos.component.html',
  styleUrls: ['./projetos.component.scss']
})
export class ProjetosComponent implements OnInit {
  displayedColumns: string[] = ['nomePrefeitura','nomeContrato', 'codigoProjeto', 'nomeProjeto', 'acoes'];
  listaProjetos: ProjetoResponse[] = [];
  dataSource = new MatTableDataSource<ProjetoResponse>(this.listaProjetos);
  projetos: ProjetosResponse;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    public _projetoControllerService: ProjetoService,
    private _toastService: ToastService,
    public _prefeituraControllerService: PrefeituraService,
    public _contratoControllerService: ContratosService,
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
      itemsPorPagina: 1000000
    };

    await this._projetoControllerService.BuscarTodosProjetos(projetoRequest)
    .then(async (res) => {
      let projetoModel: ProjetoResponse[] = [];
      let listaPrefeituras: PrefeituraResponse[] = await this.buscarPrefeituras();

      res.data.forEach((res) => {
        let prefeitura = res.contratos.length == 0 ? null : 
        listaPrefeituras.find(resPf => resPf.idPrefeitura == res.contratos[0].contratos.prefeituraId);

        const projeto: ProjetoResponse = {
          idProjeto: res.idProjeto,
          nomeProjeto: res.nomeProjeto,
          nomePrefeitura: prefeitura ? prefeitura.nome : '',
          codigoProjeto: res.codigoProjeto,
          nomeContrato: res.contratos.length != 0 ? res.contratos[0].contratos.numeroContrato : '',
          contratos: res.contratos
        };

        projetoModel.push(projeto);
      });
      this.listaProjetos = projetoModel;
      this.dataSource.data = this.listaProjetos;
    })
    .catch((erro) => {
      console.error(erro);
      this._toastService.mensagemError('Erro ao buscar projetos!');
    });
  }

  async buscarPrefeituras(): Promise<PrefeituraResponse[]> {
      var prefeituraFilter : PrefeituraFilter = new PrefeituraFilter();
      prefeituraFilter.nome = "";
      prefeituraFilter.itemsPorPagina = 1000000;
      prefeituraFilter.pagina = 1;

      try {
        const result = await this._prefeituraControllerService.BuscarTodasPrefeituras(prefeituraFilter);
        return result.data;
      } catch (error) {
        console.error('Erro ao buscar prefeituras:', error);
        return [];
      }
  }

  async deleteProject(id: number) {
    const dialogRef = this.dialog.open(ConfirmaExclusaoComponent);

    dialogRef.afterClosed().subscribe(async result => {

      if(result){
        let projeto = this.listaProjetos.find(res => res.idProjeto == id);

      if (projeto.contratos.length == 0) {
        this._projetoControllerService.DeletarProjeto(id)
        .then((res) => {
          this.getAllProjects();
          this._toastService.mensagemSuccess("Sucesso ao deletar projeto!");
        })
        .catch((erro) => {
          this._toastService.mensagemError('Erro ao deletar projeto!');
        });
      }
      else {
        let vinculoProjetoContrato: VinculoProjetoContratoRequest = {
          idProjeto: id,
          idContrato: projeto.contratos[0].idContrato
        };
        await this._contratoControllerService.removerProjetoContrato(vinculoProjetoContrato)
        .then((res) => {
          this._projetoControllerService.DeletarProjeto(id)
          .then((res) => {
            this.getAllProjects();
            this._toastService.mensagemSuccess("Sucesso ao deletar projeto!");
          })
          .catch((erro) => {
            this._toastService.mensagemError('Erro ao deletar projeto!');
          });
        })
        .catch((res) => {
          this._toastService.mensagemError('Erro ao deletar vinculo projeto!');
          console.error(res);
        });
      }
    }
  });
  }
}
