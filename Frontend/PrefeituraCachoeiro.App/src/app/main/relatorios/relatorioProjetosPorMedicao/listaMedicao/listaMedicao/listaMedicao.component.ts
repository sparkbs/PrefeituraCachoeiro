import { AfterViewInit, Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalServicesService } from 'src/app/GlobalServices/GlobalServices.service';
import { AlterarMedicaoProjetoRequest, BuscarArquivosMedicaoIdProjRequest, BuscarArquivosMedicaRequest, DadosMedicoesRequest, RegistroDocumentosMedicoesRequest } from 'src/app/request/MedicoesRequest/medicoesRequest';
import { ArquivosMedicoesProjetoResponse, BuscarArquivosMedicaoResponse, Contrato, Empresa, Item, ItemContrato, ItemMedicao, MedicoesResponse, Origem, Prefeitura, Projeto, Quantidade, StatusMedicao } from 'src/app/response/medicoesResponse/medicoesResponse';
import { MedicoesService } from 'src/app/services/medicoes.service';
import { ProjetoService } from 'src/app/services/projeto.service';
import { ToastService } from 'src/app/services/toast.service';
import { AprovarMedicaoComponent } from '../../../../aprovacaoBoletim/aprovarMedicao/aprovarMedicao.component';
import { StatusMedicaoEnum } from 'src/app/enums/statusMedicao';
import { ModalLevantamentoComponent } from '../../../modalLevantamento/modalLevantamento.component';
import { ListaDocumentosContrato } from 'src/app/response/contratosResponse/dadosContratoResponse';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StatusOrdenacao } from 'src/app/enums/statusOrdenacao';
import { ContratosResponse } from 'src/app/response/contratosResponse/todosContratosResponse';
import { OrigemArquivoAnexadoEnum } from 'src/app/enums/origemArquivoAnexado';
import { ConfirmaExclusaoComponent } from 'src/app/shared/confirma-exclusao/confirma-exclusao.component';
import { AuthService } from 'src/app/services/auth.service';
import { CookieService } from 'ngx-cookie-service';
import { AESEncryptDecriptService } from 'src/app/shared/aesEncryptDecript.service';
import { PerfilLogin } from 'src/app/enums/perfilLogin';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listaMedicao',
  templateUrl: './listaMedicao.component.html',
  styleUrls: ['./listaMedicao.component.scss']
})
export class ListaMedicaoComponent implements OnInit, OnChanges, AfterViewInit {
  readonly dialog = inject(MatDialog);
  @ViewChild('documentoInput') documentoInput: any;
  @Input() medicoes: MedicoesResponse = new MedicoesResponse();
  @Output() atualizarListaMedicao = new EventEmitter<string>();
  StatusEnum = StatusMedicaoEnum;  // Expondo o enum no componente
  isLoading = false;
  listaDocumentoContrato: BuscarArquivosMedicaoResponse[] = [];
  isDivVisible: boolean = false;
  isDisabledBtnEnviar = true;
  arquivosAnexadosTelaMedicao: ArquivosMedicoesProjetoResponse[] =[];
  arquivosAnexadosTelaAprovacao: ArquivosMedicoesProjetoResponse[] =[];
  arquivosAnexadosTelaRecusada: ArquivosMedicoesProjetoResponse[] =[];

  statusOrdem: StatusOrdenacao = StatusOrdenacao.SemOrdem;

  dataSource: MatTableDataSource<ItemMedicao>;
  displayedColumns: string[] = ['item', 'item/qtd', 'valor(s)cBdi' , 'valorTotal/bdi','qtdRestante', 'qtdMedicaoItem', 'valorTotalMedidaBdi', 'valorSaldoRestante'];

  @ViewChild(MatSort) sort!: MatSort;

  permissaoAcesso: PerfilLogin;
  UserRole = PerfilLogin; // necessário para usar no template
  alterarMedicaoProjeto = false;
  constructor( private authService: AuthService, private readonly aesEncryptDecript: AESEncryptDecriptService, 
      private router: Router ,private readonly apiMedicao: MedicoesService, private readonly api: ProjetoService,private globalService: GlobalServicesService,private _toastService: ToastService) {
    this.dataSource = new MatTableDataSource(this.medicoes.items);
   }

   definirOrdem(){
    if(this.statusOrdem == StatusOrdenacao.SemOrdem){
      this.statusOrdem = StatusOrdenacao.Decrescente;
    }
    else if(this.statusOrdem == StatusOrdenacao.Decrescente){
      this.statusOrdem = StatusOrdenacao.Crescente;
    }
    else{
      this.statusOrdem = StatusOrdenacao.SemOrdem;
    }
   }

     async deleteContrato(id: any){
       const dialogRef = this.dialog.open(ConfirmaExclusaoComponent);
       dialogRef.afterClosed().subscribe(async result => {
        this.isLoading = true;
         if(result){
   
           await this.apiMedicao.DeletarMedicao(id)  
           .then((result) => {
             this.medicoes = null;
             this.atualizarListaMedicao.emit('Medição deletada com sucesso');
           });
         }
        this.isLoading = false;
       });
     }

     ordemItens() {
      this.definirOrdem();
    
      if (this.statusOrdem == StatusOrdenacao.Decrescente) {
        this.dataSource.data = this.dataSource.data.sort((a, b) => {
          return Number(b.itemsContrato.item.identificador) - Number(a.itemsContrato.item.identificador);
        });
      } else if (this.statusOrdem == StatusOrdenacao.Crescente) {
        this.dataSource.data = this.dataSource.data.sort((a, b) => {
          return Number(a.itemsContrato.item.identificador) - Number(b.itemsContrato.item.identificador);
        });
      }
    }
    
  openBoletimReprovada() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/main/boletimRecusadaPorProjeto',this.medicoes.contratos.prefeituraId,this.medicoes.idContrato, this.medicoes.idProjeto, this.medicoes.numeroMedicao])
    );
    window.open(url, '_blank');  // Abre em uma nova guia
  }

  ngOnInit() {
    const cookieValue = this.authService.getCookie('_acesso');
    this.permissaoAcesso = this.aesEncryptDecript.decrypt(cookieValue);

    //if(this.medicoes.statusMedicao.idStatusMedicao != StatusMedicaoEnum.Aprovada){    

    this.medicoes.items.forEach(item =>{
      item.unidadeSalvaMedida = item.unidade;
      if(item?.itemsContrato != null && item.itemsContrato.valorComBdi != null){
        this.globalService.addItem(item.itemsContrato.item.descricao, item.itemsContrato.unidade, item.idItemContrato, item.unidade, this.medicoes.contratos.isContratoGlobal, this.medicoes.statusMedicao.idStatusMedicao)
      }
    })
  //}

    this.arquivosAnexadosTelaMedicao = this.medicoes.arquivosMedicoesProjeto.filter(x => x.idOrigemArquivo == OrigemArquivoAnexadoEnum.Medicao);
    this.arquivosAnexadosTelaAprovacao = this.medicoes.arquivosMedicoesProjeto.filter(x => x.idOrigemArquivo == OrigemArquivoAnexadoEnum.Aprovacao);
    this.arquivosAnexadosTelaRecusada = this.medicoes.arquivosMedicoesProjeto.filter(x => x.idOrigemArquivo == OrigemArquivoAnexadoEnum.Recusada);

    /*const cleanUrlsWithId = this.medicoes.arquivosMedicoesProjeto.map(x => {
      const arquivoMedicao = x.arquivoMedicao.replace("https://imagensprefeituracachoeiro.s3.amazonaws.com/", ""); // Remove o prefixo

      // Retorna um objeto contendo o ID e a URL limpa
      return { id: x.id, arquivoMedicao };
    });

    this.medicoes.arquivosMedicoesProjeto = cleanUrlsWithId*/
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
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
      this.medicoes.items = this.medicoes.items.filter(x => x.itemsContrato.valorComBdi != null)

      this.dataSource.data = this.medicoes.items || [];
      this.dataSource.sort = this.sort;
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
      let somaTotal = this.somarValorTotal();

      if(somaTotal > this.medicoes.contratos.valorAtualContrato){
        this._toastService.mensagemError("O valor total a medir é superior ao valor total contrato + aditivo.");
        item.unidade = item.unidadeSalvaMedida;
      }
      else
      {
        this.globalService.addItem("",0, item.idItemContrato,quantidade, this.medicoes.contratos.isContratoGlobal, this.medicoes.statusMedicao.idStatusMedicao)
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
    this.dataSource.sort = this.sort;
  }

  buscarItemMedicao(idItemContrato: number){
    if(this.globalService.getItems(idItemContrato).quantidades < 0 && this.medicoes.contratos.isContratoGlobal)
    {
      return 0;
    }
    else{
      return this.globalService.getItems(idItemContrato).quantidades;
    }
  }

  buscarSaldoItemMedicao(idItemContrato: number){
    if(this.globalService.getItems(idItemContrato)?.quantidades < 0 && this.medicoes.contratos.isContratoGlobal)
    {
      return 0;
    }
    else{
      return this.globalService.getItems(idItemContrato)?.quantidades?.toFixed(6).replace(".",",");
    }
  }


  /*async reprovarMedicao(idMedicao: number){
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
  }*/

  enableEditInput(){
    this.alterarMedicaoProjeto = !this.alterarMedicaoProjeto;
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

  nomeProjeto(id:number){
    return this.medicoes?.contratos?.projetos?.find(x => x.idProjeto == id )?.nomeProjeto;
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
      alterarMedicaoRequest.secretaria = this.medicoes?.secretaria ?? "";
      alterarMedicaoRequest.idMedicoesProjeto = this.medicoes.idMedicoesProjeto;
      alterarMedicaoRequest.idProjeto = this.medicoes.idProjeto;
      const novaLista = this.medicoes.items.map(item => ({
        idItemContrato: item.idItemContrato,
        unidade: item.unidade || 0
      }));
      alterarMedicaoRequest.items = novaLista;
      alterarMedicaoRequest.numeroMedicao = this.medicoes.numeroMedicao;
      alterarMedicaoRequest.observacao = this.medicoes.observacao;
      alterarMedicaoRequest.resumo = this.medicoes?.resumo ?? "";
      alterarMedicaoRequest.periodoMedicao = this.medicoes?.periodoMedicao ?? "";

      if(this.medicoes.statusMedicao.idStatusMedicao == this.StatusEnum.Recusada){
        this.medicoes.statusMedicao.nome = "Em Edição"
        this.medicoes.statusMedicao.idStatusMedicao = this.StatusEnum.EmEdicao
      }


      await this.apiMedicao.AlterarMedicoes(alterarMedicaoRequest)
      .then((result) => {
        this._toastService.mensagemSuccess("Sucesso ao salvar medição.");
        this.isDisabledBtnEnviar = false;
      })
      .catch((erro) => {
        this._toastService.mensagemError(erro.error.message);
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
    const contrato = this.medicoes.contratos;
    this.dialog.open(ModalLevantamentoComponent, {
          width: window.innerWidth >= 1450 ? '80%' : '60%',
          data: { idProjeto, contrato }
        }).afterClosed().subscribe(
          (res) => {
    });
  }

  goToHistoricoProjeto() {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/main/historicoProjeto'])
    );
    window.open(url, '_blank');
  }

  async adicionarDocumento(){
    this.isLoading = true;

    if(this.documentoInput.nativeElement.files[0] != undefined){
      const documentoFile = this.documentoInput.nativeElement.files[0] as File;

      var request = new RegistroDocumentosMedicoesRequest();
      request.IdMedicoesProjeto = this.medicoes.idMedicoesProjeto;
      request.Arquivos = (documentoFile);
      await this.apiMedicao.RegistrarDocumentosMedicoes(request)
      .then((result) => {
        var arqMed = new ArquivosMedicoesProjetoResponse();
        arqMed.id = result.ids[0].id;
        arqMed.arquivoMedicao = result.ids[0].arquivoMedicao;
        arqMed.arquivo = documentoFile.name;
        arqMed.idOrigemArquivo = 1;

        this.arquivosAnexadosTelaMedicao.push(arqMed);

        this.medicoes.arquivosMedicoesProjeto.push(arqMed);
      })
      .catch(() =>
      {
        this.isLoading = false;
      });

      await this.buscarArquivosMedicao();

      this.documentoInput.nativeElement.value = '';
    }
    this.isLoading = false;
  }

  async deletarDocumentoMedicao(idDocumento: number) {
    this.isLoading = true;
    // Filtra os documentos, removendo o que for igual ao item a ser deletado
    await this.apiMedicao.DeletarArquivoMedicao(idDocumento)
    .then(async (result) => {
      this._toastService.mensagemSuccess("Documento deletado com sucesso.");
      this.arquivosAnexadosTelaMedicao = this.arquivosAnexadosTelaMedicao.filter(x => x.id != idDocumento && x.idOrigemArquivo == OrigemArquivoAnexadoEnum.Medicao);
    })
    .catch(() =>
    {
      this._toastService.mensagemSuccess("Erro ao deletar documento.");
    })
    .finally(()=>{
      this.isLoading = false;
    });
  }

  async deletarDocumentoAprovacao(idDocumento: number) {
    this.isLoading = true;
    // Filtra os documentos, removendo o que for igual ao item a ser deletado
    await this.apiMedicao.DeletarArquivoMedicao(idDocumento)
    .then(async (result) => {
      this._toastService.mensagemSuccess("Documento deletado com sucesso.");
      this.arquivosAnexadosTelaAprovacao = this.arquivosAnexadosTelaAprovacao.filter(x => x.id != idDocumento && x.idOrigemArquivo == OrigemArquivoAnexadoEnum.Aprovacao);
    })
    .catch(() =>
    {
      this._toastService.mensagemSuccess("Erro ao deletar documento.");
    })
    .finally(()=>{
      this.isLoading = false;
    });
  }

  async downloadDocumento(idDocumento: number, arquivo:string) {
    this.isLoading = true;
    // Filtra os documentos, removendo o que for igual ao item a ser deletado
    await this.apiMedicao.DownloadArquivoMedicao(idDocumento)
    .then((result) => {
      const url = window.URL.createObjectURL(result);
      const a = document.createElement('a');
      a.href = url;
      a.download = arquivo;  // Você pode definir o nome do arquivo
      a.click();
      window.URL.revokeObjectURL(url);  // Limpar a URL após o download
      this._toastService.mensagemSuccess("Download realizado com sucesso.");
    })
    .catch((erro) =>
    {
      this._toastService.mensagemError(erro.error.message);
    })
    .finally(()=>{
      this.isLoading = false;
    });
  }

  toggleDiv() {
    this.isDivVisible = !this.isDivVisible;
  }

  async enviar(IdMedicoesProjeto: number){
    this.isLoading = true;
    const result = window.confirm('Você deseja enviar a medição?');
    if (result) {
      var req = new BuscarArquivosMedicaoIdProjRequest();
      req.IdMedicoesProjeto = IdMedicoesProjeto;

      await this.apiMedicao.EnviarMedicaoCliente(req)
      .then((result) => {
        if(result.isSucesso){
          this._toastService.mensagemSuccess("Medição enviada com sucesso");
        }
        else{
          this._toastService.mensagemSuccess(result.mensagemErro);
        }
      })
      .catch((erro) =>
      {
        this._toastService.mensagemError(erro.error.message);
      })
      .finally(()=>{
        this.isLoading = false;
      });

    }
  }
}
