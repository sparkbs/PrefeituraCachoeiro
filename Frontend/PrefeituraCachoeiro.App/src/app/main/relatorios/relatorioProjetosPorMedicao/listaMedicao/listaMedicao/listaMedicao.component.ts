import { Component, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalServicesService } from 'src/app/GlobalServices/GlobalServices.service';
import { AlterarMedicaoProjetoRequest, BuscarArquivosMedicaRequest, DadosMedicoesRequest, RegistroDocumentosMedicoesRequest } from 'src/app/request/MedicoesRequest/medicoesRequest';
import { BuscarArquivosMedicaoResponse, Contrato, Empresa, Item, ItemContrato, ItemMedicao, MedicoesResponse, Origem, Prefeitura, Projeto, Quantidade, StatusMedicao } from 'src/app/response/medicoesResponse/medicoesResponse';
import { MedicoesService } from 'src/app/services/medicoes.service';
import { ProjetoService } from 'src/app/services/projeto.service';
import { ToastService } from 'src/app/services/toast.service';
import { AprovarMedicaoComponent } from '../../../../aprovacaoBoletim/aprovarMedicao/aprovarMedicao.component';
import { StatusMedicaoEnum } from 'src/app/enums/statusMedicao';
import { ModalLevantamentoComponent } from '../../../modalLevantamento/modalLevantamento.component';
import { ListaDocumentosContrato } from 'src/app/response/contratosResponse/dadosContratoResponse';

@Component({
  selector: 'app-listaMedicao',
  templateUrl: './listaMedicao.component.html',
  styleUrls: ['./listaMedicao.component.scss']
})
export class ListaMedicaoComponent implements OnInit, OnChanges {
  readonly dialog = inject(MatDialog);
  @ViewChild('documentoInput') documentoInput: any;
  @Input() medicoes: MedicoesResponse = new MedicoesResponse();
  StatusEnum = StatusMedicaoEnum;  // Expondo o enum no componente
  isLoading = false;
  listaDocumentoContrato: BuscarArquivosMedicaoResponse[] = [];

  dataSource: MatTableDataSource<ItemMedicao>;
  displayedColumns: string[] = ['item', 'item/qtd', 'valor(s)cBdi' , 'valorTotal/bdi','qtdRestante', 'qtdMedicaoItem', 'valorTotalMedidaBdi', 'valorSaldoRestante'];

  alterarMedicaoProjeto = false;
  constructor(private readonly apiMedicao: MedicoesService, private readonly api: ProjetoService,private globalService: GlobalServicesService,private _toastService: ToastService) {
    this.dataSource = new MatTableDataSource(this.medicoes.items);
   }

  async ngOnInit() {
    this.medicoes.items.forEach(item =>{
      item.unidadeSalvaMedida = item.unidade;
      if(item?.itemsContrato != null){
        this.globalService.addItem(item.itemsContrato.item.descricao, item.itemsContrato.unidade, item.idItemContrato, item.unidade)
      }
    })

    await this.buscarArquivosMedicao();
  }

  async buscarArquivosMedicao(){
    var arquivosRequest = new BuscarArquivosMedicaRequest();
    arquivosRequest.itemsPorPagina = 1000000;
    arquivosRequest.pagina = 1;
    arquivosRequest.IdMedicoesProjeto = this.medicoes.idMedicoesProjeto;

    await this.apiMedicao.BuscarArquivosMedicoes(arquivosRequest)
      .then((result) => {
        this.listaDocumentoContrato = result.data;
      })
      .catch(() => 
      {
      });
  }

  buscarProjetos(idProjeto: number){
    return this.medicoes.contratos.projetos.find(x => x.idProjeto == idProjeto).nomeProjeto;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['medicoes']) {
      this.dataSource.data = this.medicoes.items || [];
    }
  }

  aprovarMedicao(idMedicao: number){
    this.dialog.open(AprovarMedicaoComponent,{data:{idMedicoesProj: idMedicao}});
  }

  onChange(item: ItemMedicao){
    if(item.unidade < 0){
      this._toastService.mensagemError("Não é permitido uma quantidade negativa!");
      item.unidade = item.unidadeSalvaMedida;
      item.itemInvalido = true;
    }
    else{
      let quantidade = item.unidade - item.unidadeSalvaMedida;
      this.globalService.addItem("",0, item.idItemContrato,quantidade)
      if(this.globalService.itemInvalido){
        item.unidade = item.unidadeSalvaMedida;
        item.itemInvalido = false;
      }
      else{
        item.unidadeSalvaMedida = item.unidade;
        item.itemInvalido = false;
      }
    }
  }

  buscarItemMedicao(idItemContrato: number){
    return this.globalService.getItems(idItemContrato).quantidades;
  }


  async reprovarMedicao(idMedicao: number){
    let request = new DadosMedicoesRequest()
    request.DataRegistro = new Date().toString();
    request.Resumo = "";
    request.IdMedicoesProjeto = idMedicao;
    await this.apiMedicao.ReprovarMedicoes(request)
    .then((result) => {
      this._toastService.mensagemSuccess("Medição reprovada com sucesso.");
    })
    .catch(() => {
      this._toastService.mensagemSuccess("Erro ao reprovar medição.");
    });
  }

  enableEditInput(){
    this.alterarMedicaoProjeto = !this.alterarMedicaoProjeto;
  }

  formatToCurrency(valor: number): string {
    let valorFormatado = valor.toFixed(2);  // 2 casas decimais

    valorFormatado = valorFormatado.replace('.', ',');

    valorFormatado = valorFormatado.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return 'R$ ' + valorFormatado;
  }

  nomeProjeto(id:number){
    return this.medicoes.contratos.projetos.find(x => x.idProjeto == id ).nomeProjeto;
  }

  somarValorTotal(){
    let valorSomado = 0;
    this.medicoes.items.forEach( x => {
      if(x)
      valorSomado += x?.unidade * x?.itemsContrato?.item?.valorComBdi
    })

    return valorSomado
  }

  somarValorSaldoTotal(){
    let valorSaldoSomado = 0;
    this.medicoes.items.forEach( x => {
      if(x?.idItemContrato != null){
        valorSaldoSomado += this.buscarItemMedicao(x.idItemContrato) * x?.itemsContrato?.item?.valorComBdi;
      }
    })

    return valorSaldoSomado
  }

  async salvar(){
    //this.quantidadeMedida = 1;
    this.isLoading = true;
    let itemInvalido = this.medicoes.items.some(x => x.itemInvalido)
    if(!itemInvalido){
      let alterarMedicaoRequest = new AlterarMedicaoProjetoRequest();
      alterarMedicaoRequest.dataMedicao = this.medicoes.dataMedicao;
      alterarMedicaoRequest.idContrato = this.medicoes.idContrato;
      alterarMedicaoRequest.idMedicoesProjeto = this.medicoes.idMedicoesProjeto;
      alterarMedicaoRequest.idProjeto = this.medicoes.idProjeto;
      const novaLista = this.medicoes.items.map(item => ({
        idItemContrato: item.idItemContrato,
        unidade: item.unidade || 0
      }));
      alterarMedicaoRequest.items = novaLista;
      alterarMedicaoRequest.numeroMedicao = this.medicoes.numeroMedicao;
      alterarMedicaoRequest.resumo = this.medicoes.resumo;

      await this.apiMedicao.AlterarMedicoes(alterarMedicaoRequest)
      .then((result) => {
      })
      .finally(()=>{
        this.isLoading = false;
      });

      this.alterarMedicaoProjeto = false;
    }
    else{
      this._toastService.mensagemError("Verifique os itens medidos para garantir que não haja quantidades restantes menores que 0.");
    }
  }

  async BuscarProjeto(id: number){
    var nome = "";
    await this.api.BuscarProjeto(id)
    .then((result) => {
      nome = result.nomeProjeto
    });
    return nome;
  }

  openModalLevantamento(idProjeto: number) {
    this.dialog.open(ModalLevantamentoComponent, {
          width: window.innerWidth >= 1450 ? '80%' : '60%',
          data: { idProjeto }
        }).afterClosed().subscribe(
          (res) => {
    });
  }

  async adicionarDocumento(){
    this.isLoading = true;

    if(this.documentoInput.nativeElement.files[0] != undefined){
      const documentoFile = this.documentoInput.nativeElement.files[0] as File;

      var request = new RegistroDocumentosMedicoesRequest();
      request.IdMedicoesProjeto = this.medicoes.idMedicoesProjeto;
      request.Arquivos.push(documentoFile);

      await this.apiMedicao.RegistrarDocumentosMedicoes(request)
      .then(() => {})
      .catch(() => 
      {
        this.isLoading = false;
      });

      await this.buscarArquivosMedicao();

      this.documentoInput.nativeElement.value = '';
    }
    this.isLoading = false;
  }

  async deletarDocumentos(idDocumento: number) {
    this.isLoading = true;
    // Filtra os documentos, removendo o que for igual ao item a ser deletado
    await this.apiMedicao.DeletarArquivoMedicao(idDocumento)
    .then(async (result) => {
      this._toastService.mensagemSuccess("Documento deletado com sucesso.");
      await this.buscarArquivosMedicao();
    })
    .catch(() => 
    {
      this._toastService.mensagemSuccess("Erro ao deletar documento.");
    })
    .finally(()=>{
      this.isLoading = false;
    });
  }


  async downloadDocumento(idDocumento: number) {
    this.isLoading = true;
    // Filtra os documentos, removendo o que for igual ao item a ser deletado
    await this.apiMedicao.DownloadArquivoMedicao(idDocumento)
    .then(async (result) => {
      this._toastService.mensagemSuccess("Download realizado com sucesso.");
    })
    .catch(() => 
    {
      this._toastService.mensagemSuccess("Erro ao realizar download documento.");
    })
    .finally(()=>{
      this.isLoading = false;
    });
  }
}
