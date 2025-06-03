import { Component, inject, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { PerfilLogin } from 'src/app/enums/perfilLogin';
import { StatusMedicaoEnum } from 'src/app/enums/statusMedicao';
import { BuscarAditivosContrato, BuscarContratosRequest } from 'src/app/request/ContratoRequest/buscarContratosRequest';
import { MedicoesRequest } from 'src/app/request/MedicoesRequest/medicoesRequest';
import {
  ArquivosContratoResponse,
  ContratosResponse,
  PrefeituraResponse,
} from 'src/app/response/contratosResponse/todosContratosResponse';
import { ArquivosAprovacao, ArquivosMedicoesProjetoResponse, ItemMedicao, MedicoesModel, MedicoesResponse, Projeto, TableMedicaoHistorico, TodasMedicaoProjetoResponse } from 'src/app/response/medicoesResponse/medicoesResponse';
import { PrefeituraFilter } from 'src/app/response/prefeituraResponse/prefeituraResponse';
import { AuthService } from 'src/app/services/auth.service';
import { ContratosService } from 'src/app/services/contratos.service';
import { MedicoesService } from 'src/app/services/medicoes.service';
import { PrefeituraService } from 'src/app/services/prefeitura.service';
import { ProjetoService } from 'src/app/services/projeto.service';
import { ToastService } from 'src/app/services/toast.service';
import { AESEncryptDecriptService } from 'src/app/shared/aesEncryptDecript.service';
import { VerDocumentosComponent } from '../aprovacaoBoletim/verDocumentos/verDocumentos.component';

@Component({
  selector: 'app-historico-boletim',
  templateUrl: './historico-boletim.component.html',
  styleUrls: ['./historico-boletim.component.scss'],
})
export class HistoricoBoletimComponent {
  readonly dialog = inject(MatDialog);
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

  displayedColumns: string[] = ['numeroMedicao', 'statusMedicao', 'projetos', 'acao'];
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
    private router: Router,
    private readonly aesEncryptDecript: AESEncryptDecriptService
  ) {}

  async ngOnInit() {
    this.isLoading = true;

    var idPrefeituraUser = this.auth.getCookie('_idPrefeitura');

    const cookieValue = this.auth.getCookie('_acesso');
    var acesso = this.aesEncryptDecript.decrypt(cookieValue);

    if (idPrefeituraUser && acesso != PerfilLogin.Admin) {
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

  somarItemMedicao(itemMedicao?: ItemMedicao[]){
    var total = 0;
    itemMedicao.forEach(x => x?.unidade > 0 ? total += (x.unidade * x.itemsContrato.item.valorComBdi) : total = total)
    return total
  }


  formatToCurrency(valor?: number): string {
    if(valor){
    let valorFormatado = valor.toFixed(2);  // 2 casas decimais

    valorFormatado = valorFormatado.replace('.', ',');

    valorFormatado = valorFormatado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return 'R$ ' + valorFormatado;
    }else{
      return 'R$ 0,00'
    }
  }

  openBoletim(idMedicao: number) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/main/boletimDetalhado', this.selectedPrefeitura, this.contratoSelecionado, idMedicao])
    );
    window.open(url, '_blank');  // Abre em uma nova guia
  }

  openBoletimGeral(idMedicao: number) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/main/boletimGeral', this.selectedPrefeitura, this.contratoSelecionado, idMedicao])
    );
    window.open(url, '_blank');  // Abre em uma nova guia
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
    this.tableMedicao = [];
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
        result.data = result.data.filter(x => x.idStatusMedicao == StatusMedicaoEnum.Aprovada);
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

  async openModalVerAnexo(numeroMedicao: number, projetosMedidos:MedicoesResponse[]){    
      this.isLoading = true
      var arquivoVisualizacao: ArquivosAprovacao = new ArquivosAprovacao();
      var todasDocumentosMedicaoProjetoResponse = await this.apiMedicoes.BuscarDocumentosMedicoes(
            this.contratoSelecionado,
            numeroMedicao
          );

      var doc:ArquivosMedicoesProjetoResponse[] = [];

      projetosMedidos.forEach(x => {
        x.arquivosMedicoesProjeto.forEach(y => {
          y.projeto = x.nomeProjeto
          doc.push(y)
        })
        
      });
  
      arquivoVisualizacao.arquivosMedicoesProjetoResponse = todasDocumentosMedicaoProjetoResponse.data;
      arquivoVisualizacao.arquivosContratosResponse = this.contrato.arquivosContratos;
      arquivoVisualizacao.arquivosAprovacao = doc;

      var aditivoFilter : BuscarAditivosContrato = new BuscarAditivosContrato();
      aditivoFilter.idContrato = this.contratoSelecionado;
      await this.api.BuscarTodosAditivos(aditivoFilter).then((result) => {
        result?.data?.forEach((item) => {
          // Soma o valorTotalComBdi de cada item
          arquivoVisualizacao.arquivosAditivosResponse.push(...item.arquivosAditivos);
        });
      })
  
      .finally(() =>{
        this.isLoading = false
      });
  
      const dialogRef = this.dialog.open(VerDocumentosComponent,{
        data: arquivoVisualizacao
      });
    }
  
}
