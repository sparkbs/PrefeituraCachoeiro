import { Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { StatusMedicaoEnum } from 'src/app/enums/statusMedicao';
import { BuscarContratosRequest } from 'src/app/request/ContratoRequest/buscarContratosRequest';
import { MedicoesRequest } from 'src/app/request/MedicoesRequest/medicoesRequest';
import {
  ContratosResponse,
  PrefeituraResponse,
} from 'src/app/response/contratosResponse/todosContratosResponse';
import { MedicoesModel, Projeto, TableMedicaoHistorico, TodasMedicaoProjetoResponse } from 'src/app/response/medicoesResponse/medicoesResponse';
import { PrefeituraFilter } from 'src/app/response/prefeituraResponse/prefeituraResponse';
import { AuthService } from 'src/app/services/auth.service';
import { ContratosService } from 'src/app/services/contratos.service';
import { MedicoesService } from 'src/app/services/medicoes.service';
import { PrefeituraService } from 'src/app/services/prefeitura.service';
import { ProjetoService } from 'src/app/services/projeto.service';
import { ToastService } from 'src/app/services/toast.service';
import { AESEncryptDecriptService } from 'src/app/shared/aesEncryptDecript.service';

@Component({
  selector: 'app-historico-boletim',
  templateUrl: './historico-boletim.component.html',
  styleUrls: ['./historico-boletim.component.scss'],
})
export class HistoricoBoletimComponent {
  selectedPrefeitura: number | null = null;
  listaPrefeitura: PrefeituraResponse[] = [];
  exibirContrato = false;
  contratoSelecionado = 0;
  listaContratos: ContratosResponse[] = [];
  medicaoProjetos: MedicoesModel[] = [];
  isLoading = false;
  contrato: ContratosResponse;
  showProjetos: boolean = false;
  tableMedicao: TableMedicaoHistorico[] = [];

  displayedColumns: string[] = ['numeroMedicao', 'statusMedicao', 'projetos'];
  dataSource = new MatTableDataSource<TableMedicaoHistorico>(this.tableMedicao);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    private readonly apiPrefeitura: PrefeituraService,
    private auth: AuthService,
    private readonly api: ContratosService,
    public _projetoControllerService: ProjetoService,
    private readonly apiMedicoes: MedicoesService,
    private _toastService: ToastService,
    private readonly aesEncryptDecript: AESEncryptDecriptService
  ) {}

  async ngOnInit() {
    this.isLoading = true;

    var idPrefeituraUser = this.auth.getCookie('_idPrefeitura');

    if (idPrefeituraUser) {
      idPrefeituraUser = this.aesEncryptDecript.decrypt(idPrefeituraUser);
      if (idPrefeituraUser) {
        await this.buscarPrefeitura(Number(idPrefeituraUser));
      } else {
        await this.buscarListaPrefeituras();
      }
    } else {
      await this.buscarListaPrefeituras();
    }

    //await this.buscarListaContratos(21);
  }

  async onSelectionChange(prefeituraId: number) {
    this.exibirContrato = true;
    this.isLoading = true;
    await this.buscarListaContratos(prefeituraId);
  }

  async buscarListaContratos(prefeituraId: number) {
    var contratosFilter: BuscarContratosRequest = new BuscarContratosRequest();
    contratosFilter.itemsPorPagina = 1000000;
    contratosFilter.IdProjeto = null;
    contratosFilter.pagina = 1;
    await this.api
      .BuscarTodosContratos(contratosFilter)
      .then((result) => {
        this.listaContratos = result.data.filter(
          (x) => x.prefeituraId == prefeituraId
        );
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  async buscar(contratoId: number) {
    this.contrato = this.listaContratos.find((x) => x.idContrato == contratoId);

    this.isLoading = true;
    await this.buscarMedicoes();
    this.showProjetos = true;
  }

  async buscarMedicoes() {
    this.medicaoProjetos = [];
    var medicoesRequest: MedicoesRequest = new MedicoesRequest();
    medicoesRequest.idContrato = this.contratoSelecionado;
    medicoesRequest.itemsPorPagina = 1000000;
    medicoesRequest.pagina = 1;
    await this.apiMedicoes
      .BuscarTodasMedicoes(medicoesRequest)
      .then((result) => {
        result.data = result.data.filter(x => x.idStatusMedicao != StatusMedicaoEnum.Enviada);
              if(result.data && result.data.length > 0){
                this.popularMedicao(result);
              }else{
                this._toastService.mensagemError("Não existe medição para listagem!");
              }
      })
      .catch((erro) => {
        this._toastService.mensagemError(erro.error.message);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  async buscarPrefeitura(id: number) {
    await this.apiPrefeitura
      .BuscarPrefeitura(id)
      .then((result) => {
        this.listaPrefeitura = [];
        this.listaPrefeitura.push(result);
      })
      .catch((erro) => {
        this._toastService.mensagemError(erro.error.message);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  async buscarListaPrefeituras() {
    var prefeituraFilter: PrefeituraFilter = new PrefeituraFilter();
    prefeituraFilter.nome = '';
    prefeituraFilter.itemsPorPagina = 1000000;
    prefeituraFilter.pagina = 1;
    await this.apiPrefeitura
      .BuscarTodasPrefeituras(prefeituraFilter)
      .then((result) => {
        this.listaPrefeitura = result.data;
      })
      .catch((erro) => {
        this._toastService.mensagemError(erro.error.message);
      })
      .finally(() => {
        this.isLoading = false;
      });
  }

  toggleHobbies(element: any): void {
    element.mostrarTodos = !element.mostrarTodos;
  }

  popularMedicao(result: TodasMedicaoProjetoResponse){
      result?.data?.forEach(valor => {
        let existeMedicao = this.medicaoProjetos.find(x => x.numeroMedicao == valor.numeroMedicao);
        if(existeMedicao){
          existeMedicao.data.push(valor);
        }
        else{
          let novoMedicao = new MedicoesModel();
          novoMedicao.numeroMedicao = valor.numeroMedicao;
          novoMedicao.data.push(valor);

          this.medicaoProjetos.push(novoMedicao);
        }
      });

      this.medicaoProjetos.forEach(res => {
        var medicao: TableMedicaoHistorico = {
          numeroMedicao: res.numeroMedicao,
          statusMedicao: res.data[0].statusMedicao,
          projetos: res.data
        };

        this.tableMedicao.push(medicao);
      });

      this.dataSource.data = this.tableMedicao;
  }

  nomeProjeto(id:number, projetos: Projeto[]){
      return id == null ? "": projetos?.find(x => x.idProjeto == id )?.nomeProjeto;
  }
}
