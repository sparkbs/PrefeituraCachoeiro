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

  constructor(private cdr: ChangeDetectorRef, 
    private readonly apiPrefeitura: PrefeituraService,
    private readonly api: ContratosService,
    private readonly apiMedicoes: MedicoesService) {
     }

  async ngOnInit() {
    //this.todasMedicaoProjetoResponse.data = this.generateMockMedicoes();
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
      this.popularTesteMedicao(result);
    });
  }

  popularTesteMedicao(result: TodasMedicaoProjetoResponse){
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
    });
  }

  async onSelectionChange(prefeituraId: number){
    this.exibirContrato = true;
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
    });
  }

  async buscar(){
    await this.buscarMedicoes();
    this.exibir = true;
    this.cdr.detectChanges();
  }

  limpar(){
    this.selectedPrefeitura = null;  // Limpar o valor selecionado
    this.contratoSelecionado = null;
    this.exibirContrato = false;
    this.exibir = false;
    this.cdr.detectChanges();
  }

  editProjeto1(){
    this.alterarMedicaoProjeto1 = !this.alterarMedicaoProjeto1;
  }

  editProjeto2(){
    this.alterarMedicaoProjeto2 = !this.alterarMedicaoProjeto2;
  }

  editProjeto3(){
    this.alterarMedicaoProjeto3 = !this.alterarMedicaoProjeto3;
  }
  
  openDialog() {
    if(this.todasMedicaoProjetoResponse?.data == undefined){
      var contrato = this.listaContratos.find(x => x.idContrato == this.contratoSelecionado);
      console.log(contrato)
      this.dialog.open(CadastrarMedicaoComponent,{data:{medicoes: contrato}});    
    }
    else{
      this.dialog.open(CadastrarMedicaoComponent,{data:{medicoes: this.todasMedicaoProjetoResponse.data[0].contratos}});    
    }
  }

  openDialogAssociate(numeroMedicao: number) {
    console.log(this.todasMedicaoProjetoResponse);
    let contrato = this.listaContratos.find(x => x.idContrato == this.contratoSelecionado);
    let medicoes = new TodasMedicaoProjetoResponse();
    medicoes.data = [{
      numeroMedicao: numeroMedicao,
      idContrato: this.contratoSelecionado,
      items: [],
  }] as MedicoesResponse[]; 
      this.dialog.open(CadastrarMedicaoComponent,{data:{medicoes: this.todasMedicaoProjetoResponse.data[0].contratos, numeroMedicao :numeroMedicao}});    
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

  generateMockMedicoes(): MedicoesResponse[] {
    return [
      {
        idMedicoesProjeto: 1,
        numeroMedicao: 1,
        idContrato: 1001,
        contratos: this.generateMockContrato(),
        dataMedicao: '2024-12-10',
        resumo: 'Resumo da medição do projeto.',
        idStatusMedicao: 1,
        statusMedicao: this.generateMockStatusMedicao(),
        items: this.generateMockItemsMedicao()
      }
    ]
  }

  generateMockContrato(): Contrato {
    return {
      idContrato: 1001,
      idProjeto: 2001,
      projetos: this.generateMockProjeto(),
      dataContrato: '2023-01-15',
      numeroContrato: 'C12345',
      valorTotalPrevisto: 500000.00,
      valorTotalSolicitado: 450000.00,
      valorTotalMedido: 400000.00,
      valorSaldoRestante: 100000.00,
      items: [this.generateMockItemContrato()],
      empresaId: 3001,
      empresa: this.generateMockEmpresa(),
      valor: 450000.00,
      tipoContratacao: 1,
      gerente: 'Carlos Silva',
      dataTermino: '2025-12-31',
      dataInicio: '2023-02-01',
      prefeituraId: 4001,
      prefeitura: this.generateMockPrefeitura()
    };
  }

  // Mock de Projeto
  generateMockProjeto(): Projeto {
    return {
      idProjeto: 2001,
      nomeProjeto: 'Projeto XYZ'
    };
  }

  // Mock de ItemContrato
  generateMockItemContrato(): ItemContrato {
    return {
      idItemContrato: 101,
      idContrato: 1001,
      itemId: 202,
      item: this.generateMockItem(),
      quantidadeId: 301,
      quantidade: this.generateMockQuantidade(),
      unidade: 1,
      valorSemBdi: 100000.00,
      valorComBdi: 120000.00,
      valorTotalComBdi: 120000.00
    };
  }

  // Mock de Item
  generateMockItem(): Item {
    return {
      idItem: 202,
      identificador: 'ABC123',
      codigo: 'XYZ001',
      origemId: 1,
      origem: this.generateMockOrigem(),
      descricao: 'Item exemplo para medição',
      unidade: 10,
      quantidadeId: 301,
      quantidade: this.generateMockQuantidade(),
      valorSemBdi: 100000.00,
      valorComBdi: 120000.00,
      valorTotalComBdi: 120000.00,
      idItemPai: 0,
      ordem: 1
    };
  }

  // Mock de Origem
  generateMockOrigem(): Origem {
    return {
      idOrigem: 1,
      nome: 'Local A'
    };
  }

  // Mock de Quantidade
  generateMockQuantidade(): Quantidade {
    return {
      idQuantidade: 301,
      nome: 'Unidade'
    };
  }

  // Mock de StatusMedicao
  generateMockStatusMedicao(): StatusMedicao {
    return {
      idStatusMedicao: 1,
      nome: 'Em andamento'
    };
  }

  // Mock de ItemMedicao
  generateMockItemsMedicao(): ItemMedicao[] {
    return [
      {
        idItemMedicoesProjeto: 1,
        idItemContrato: 101,
        itemsContrato: this.generateMockItemContrato(),
        unidade: 10
      }
    ];
  }

  // Mock de Empresa
  generateMockEmpresa(): Empresa {
    return {
      empresaId: 3001,
      nome: 'Construtora Exemplo Ltda',
      logo: 'logo-empresa.png'
    };
  }

  // Mock de Prefeitura
  generateMockPrefeitura(): Prefeitura {
    return {
      idPrefeitura: 4001,
      nome: 'Prefeitura Municipal Exemplo',
      logo: 'logo-prefeitura.png'
    };
  }
}
