import { ChangeDetectorRef, Component, inject, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatAccordion} from '@angular/material/expansion';
import { CadastrarMedicaoComponent } from './cadastrarMedicao/cadastrarMedicao/cadastrarMedicao.component';
import { ContratosService } from 'src/app/services/contratos.service';
import { BuscarContratosRequest } from 'src/app/request/ContratoRequest/buscarContratosRequest';
import { PrefeituraFilter, PrefeituraResponse } from 'src/app/response/prefeituraResponse/prefeituraResponse';
import { PrefeituraService } from 'src/app/services/prefeitura.service';
import { ContratosResponse } from 'src/app/response/contratosResponse/todosContratosResponse';
import { MedicoesService } from 'src/app/services/medicoes.service';
import { MedicoesRequest } from 'src/app/request/MedicoesRequest/medicoesRequest';
import { Contrato, Empresa, Item, ItemContrato, ItemMedicao, MedicoesModel, MedicoesResponse, Origem, Prefeitura, Projeto, Quantidade, StatusMedicao, TodasMedicaoProjetoResponse } from 'src/app/response/medicoesResponse/medicoesResponse';
import { ResumoMedicaoComponent } from './resumoMedicao/resumoMedicao/resumoMedicao.component';
import { GlobalServicesService } from 'src/app/GlobalServices/GlobalServices.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-relatorioProjetosPorMedicao',
  templateUrl: './relatorioProjetosPorMedicao.component.html',
  styleUrls: ['./relatorioProjetosPorMedicao.component.scss']
})
export class RelatorioProjetosPorMedicaoComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  listaPrefeitura: PrefeituraResponse[] = [];
  listaContratos: ContratosResponse[] = [];

  @ViewChildren(MatAccordion) accordions!: QueryList<MatAccordion>; 
  exibir = false;
  alterarMedicaoProjeto1 = false;
  alterarMedicaoProjeto2 = false;
  alterarMedicaoProjeto3 = false;
  exibirContrato = false;
  contratoSelecionado = 0;
  todasMedicaoProjetoResponse = new TodasMedicaoProjetoResponse();
  selectedPrefeitura: number | null = null; // Valor selecionado
  medicaoProjetos : MedicoesModel[] = [];
  isLoading = false;

  constructor(private cdr: ChangeDetectorRef, 
    private readonly apiPrefeitura: PrefeituraService,
    private readonly api: ContratosService,
    private readonly apiMedicoes: MedicoesService,
    private globalService: GlobalServicesService,
    private _toastService: ToastService) {
     }

  async ngOnInit() {
    //this.todasMedicaoProjetoResponse.data = this.generateMockMedicoes();
    this.isLoading = true;
    await this.buscarListaPrefeituras();
  }

  async buscarMedicoes(){
    this.medicaoProjetos = [];
    var medicoesRequest : MedicoesRequest = new MedicoesRequest();
    medicoesRequest.idContrato = this.contratoSelecionado;
    medicoesRequest.itemsPorPagina = 1000000;
    medicoesRequest.pagina = 1;
    await this.apiMedicoes.BuscarTodasMedicoes(medicoesRequest)
    .then((result) => {      
      this.todasMedicaoProjetoResponse = result;
      this.popularMedicao(result);
    }).catch(() => {
      this._toastService.mensagemError("Erro ao buscar medições!");
    })
    .finally(() =>{
      this.isLoading = false;
    });;
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
    })
  }

  async buscarListaPrefeituras(){
    var prefeituraFilter : PrefeituraFilter = new PrefeituraFilter();
    prefeituraFilter.nome = "";
    prefeituraFilter.itemsPorPagina = 1000000;
    prefeituraFilter.pagina = 1;
    await this.apiPrefeitura.BuscarTodasPrefeituras(prefeituraFilter)
    .then((result) => {
      this.listaPrefeitura = result.data;
    })
    .catch(() => {
      this._toastService.mensagemError("Erro ao buscar prefeitura!");
    })
    .finally(() =>{
      this.isLoading = false;
    });
  }

  async onSelectionChange(prefeituraId: number){
    this.exibirContrato = true;
    this.isLoading = true;
    await this.buscarListaContratos(prefeituraId);
  }

  async buscarListaContratos(prefeituraId: number){
    var contratosFilter : BuscarContratosRequest = new BuscarContratosRequest();
    contratosFilter.itemsPorPagina = 1000000;
    contratosFilter.IdProjeto = null;
    contratosFilter.pagina = 1;
    await this.api.BuscarTodosContratos(contratosFilter)
    .then((result) => {
      this.listaContratos = result.data.filter(x => x.prefeituraId == prefeituraId);
    })
    .catch(() => {
      this._toastService.mensagemError("Erro ao buscar contratos!");
    })
    .finally(() =>{
      this.isLoading = false;
    });;
  }

  async buscar(){
    this.isLoading = true;
    await this.buscarMedicoes();
    this.exibir = true;
    this.globalService.resetItems();
    this.cdr.detectChanges();
  }

  limpar(){
    this.selectedPrefeitura = null;  // Limpar o valor selecionado
    this.contratoSelecionado = null;
    this.exibirContrato = false;
    this.exibir = false;
    this.cdr.detectChanges();
  }

  openDialog() {
    if(this.todasMedicaoProjetoResponse?.data == undefined){
      var contrato = this.listaContratos.find(x => x.idContrato == this.contratoSelecionado);
      const dialogRef = this.dialog.open(CadastrarMedicaoComponent,{data:{medicoes: contrato, numeroMedicao :1}});

      dialogRef.afterClosed().subscribe(async result => {
        if(result){
          await this.apiMedicoes.BuscarMedicoes(result)
          .then((response) => {      
            let novoMedicao = new MedicoesModel();
            novoMedicao.numeroMedicao = response.numeroMedicao;
            novoMedicao.data.push(response);
    
            this.medicaoProjetos.push(novoMedicao);   
          });          
        }
      });
    }
    else{
      console.log(this.todasMedicaoProjetoResponse)
      var numeroMedicao = this.todasMedicaoProjetoResponse.data.sort((a, b) => {
        return b.numeroMedicao - a.numeroMedicao;  // Ordem decrescente
      });
      
      const maiorNumero = numeroMedicao[0].numeroMedicao + 1;

      console.log(maiorNumero);

      const dialogRef = this.dialog.open(CadastrarMedicaoComponent,{data:{medicoes: this.todasMedicaoProjetoResponse.data[0].contratos , numeroMedicao :maiorNumero }});

      dialogRef.afterClosed().subscribe(async result => {
        if(result){
          await this.apiMedicoes.BuscarMedicoes(result)
          .then((response) => {      
            let novoMedicao = new MedicoesModel();
            novoMedicao.numeroMedicao = response.numeroMedicao;
            novoMedicao.data.push(response);
            this.todasMedicaoProjetoResponse.data.push(response);
            this.medicaoProjetos.push(novoMedicao);   
          });          
        }
      });
    }
  }

  openDialogAssociate(numeroMedicao: number) {
    console.log(this.todasMedicaoProjetoResponse);
    //let contrato = this.listaContratos.find(x => x.idContrato == this.contratoSelecionado);
    let medicoes = new TodasMedicaoProjetoResponse();
    medicoes.data = [{
      numeroMedicao: numeroMedicao,
      idContrato: this.contratoSelecionado,
      items: [],
  }] as MedicoesResponse[]; 
      const dialogRef = this.dialog.open(CadastrarMedicaoComponent,{data:{medicoes: this.todasMedicaoProjetoResponse.data[0].contratos, numeroMedicao :numeroMedicao}});    
      dialogRef.afterClosed().subscribe(async result => {
        if(result){
          await this.apiMedicoes.BuscarMedicoes(result)
          .then((response) => {      
            let novoMedicao = new MedicoesModel();
            novoMedicao.numeroMedicao = response.numeroMedicao;
            novoMedicao.data.push(response);
    
            this.medicaoProjetos.push(novoMedicao);   
          });          
        }
      });
  }

  openDialogConsolidado(medicao: MedicoesResponse){
    this.dialog.open(ResumoMedicaoComponent,{data:
      medicao
    });    
  }

  closeAllAccordions() {
    this.accordions.toArray().forEach(acc => acc.closeAll());
  }

  openAllAccordions() {
    this.accordions.toArray().forEach(acc => acc.openAll());
  }
}
