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
import { AlterarMedicaoProjetoRequest, BuscarArquivosMedicaoIdProjRequest, MedicoesRequest, RegistroDocumentosPorMedicoesRequest } from 'src/app/request/MedicoesRequest/medicoesRequest';
import { ArquivosMedicoesProjetoResponse, Contrato, DocumentosMedicoesModel, Empresa, IdsResponse, Item, ItemContrato, ItemMedicao, MedicoesModel, MedicoesResponse, Origem, Prefeitura, Projeto, Quantidade, StatusMedicao, TodasMedicaoProjetoResponse } from 'src/app/response/medicoesResponse/medicoesResponse';
import { ResumoMedicaoComponent } from './resumoMedicao/resumoMedicao/resumoMedicao.component';
import { GlobalServicesService, ItensMedidos } from 'src/app/GlobalServices/GlobalServices.service';
import { ToastService } from 'src/app/services/toast.service';
import { AESEncryptDecriptService } from 'src/app/shared/aesEncryptDecript.service';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { StatusMedicaoEnum } from 'src/app/enums/statusMedicao';
import { ModalReaproveitarMedicaoComponent } from '../modalReaproveitarMedicao/modalReaproveitarMedicao.component';
import { PerfilLogin } from 'src/app/enums/perfilLogin';
import { DadosContratoResponse } from 'src/app/response/contratosResponse/dadosContratoResponse';

@Component({
  selector: 'app-relatorioProjetosPorMedicao',
  templateUrl: './relatorioProjetosPorMedicao.component.html',
  styleUrls: ['./relatorioProjetosPorMedicao.component.scss']
})
export class RelatorioProjetosPorMedicaoComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  listaPrefeitura: PrefeituraResponse[] = [];
  listaContratos: ContratosResponse[] = [];
  @ViewChild('documentoInput') documentoInput: any;

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
  listaFiltrada: any[] = [];
  contratoSelecionadoEstrutura: ContratosResponse = null;
  arquivosAnexadosTelaMedicao: ArquivosMedicoesProjetoResponse[] =[];
  todasDocumentosMedicaoProjetoResponse = new DocumentosMedicoesModel();
  observacao: string = "";

  constructor(private cdr: ChangeDetectorRef,
    private readonly apiPrefeitura: PrefeituraService,
    private readonly api: ContratosService,
    private readonly apiMedicoes: MedicoesService,
    private globalService: GlobalServicesService,
    private _toastService: ToastService,
    private readonly apiEmpresa: EmpresaService,
    private auth: AuthService,
    private readonly aesEncryptDecript: AESEncryptDecriptService) {
     }

  async ngOnInit() {
    //this.todasMedicaoProjetoResponse.data = this.generateMockMedicoes();
    this.isLoading = true;
    var idPrefeituraUser = this.auth.getCookie("_idPrefeitura");

    const cookieValue = this.auth.getCookie('_acesso');
    var acesso = this.aesEncryptDecript.decrypt(cookieValue);


    if(idPrefeituraUser && acesso != PerfilLogin.Admin){
      idPrefeituraUser = this.aesEncryptDecript.decrypt(idPrefeituraUser);
      if(idPrefeituraUser){
        await this.buscarPrefeitura(Number(idPrefeituraUser));
      }
      else{
        await this.buscarListaPrefeituras();
      }
    }else{
      await this.buscarListaPrefeituras();
    }
    this.listaFiltrada = [...this.listaPrefeitura];


  }

  async salvar(medicoesResponse: MedicoesResponse[]){
    this.isLoading = true;
    medicoesResponse.forEach(async x => {
      x.resumo = medicoesResponse[0].resumo ?? "";

      let alterarMedicaoRequest = new AlterarMedicaoProjetoRequest();
      alterarMedicaoRequest.dataMedicao = x.dataMedicao;
      alterarMedicaoRequest.idContrato = x.idContrato;
      alterarMedicaoRequest.secretaria = x?.secretaria ?? "";
      alterarMedicaoRequest.idMedicoesProjeto = x.idMedicoesProjeto;
      alterarMedicaoRequest.idProjeto = x.idProjeto;
      const novaLista = x.items.map(item => ({
        idItemContrato: item.idItemContrato,
        unidade: item.unidade || 0
      }));
      alterarMedicaoRequest.items = novaLista;
      alterarMedicaoRequest.numeroMedicao = x.numeroMedicao;
      alterarMedicaoRequest.observacao = x.observacao;
      alterarMedicaoRequest.periodoMedicao = x?.periodoMedicao ?? "";
      alterarMedicaoRequest.resumo = x.resumo ?? "";

      await this.apiMedicoes.AlterarMedicoes(alterarMedicaoRequest)
      .then((result) => {
        this._toastService.mensagemSuccess("Sucesso ao salvar observacao.");
      })
      .catch((erro) => {
        this._toastService.mensagemError(erro.error.message);
      })
      .finally(() =>{
        this.isLoading = false;
      });
    });
  }

  async buscarPrefeitura(id: number){
    await this.apiPrefeitura.BuscarPrefeitura(id)
    .then((result) => {
      this.listaPrefeitura = [];
      this.listaPrefeitura.push(result);
    })
    .catch(() => {
      this._toastService.mensagemError("Erro ao buscar prefeitura!");
    })
    .finally(() =>{
      this.isLoading = false;
    });
  }

  somarValorTotalMedicao(medicao: MedicoesResponse[], numero: number){
    let valorSomado = 0;

    var itemsMedidos = medicao.filter(x => x.numeroMedicao == numero);

    itemsMedidos.forEach( x => {
      if(x){
        x.items.forEach(y => {
          if(y)
            valorSomado += y?.unidade * y?.itemsContrato?.item?.valorComBdi
        })
      }
    })

    return valorSomado
  }

  periodoMedicao(medicao: MedicoesResponse[], numero: number){
    var itemsMedidos = medicao.filter(x => x.numeroMedicao == numero);

    if(itemsMedidos[0]?.periodoMedicao){
      return itemsMedidos[0]?.periodoMedicao;
    }
    else{
      return ""
    }
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

  async buscarMedicoes(){
    this.medicaoProjetos = [];
    var medicoesRequest : MedicoesRequest = new MedicoesRequest();
    medicoesRequest.idContrato = this.contratoSelecionado;
    medicoesRequest.itemsPorPagina = 1000000;
    medicoesRequest.pagina = 1;
    await this.apiMedicoes.BuscarTodasMedicoes(medicoesRequest)
    .then(async (result) => {
      this.todasMedicaoProjetoResponse = result;
      await this.popularMedicao(result);
    }).catch((erro) => {
      this._toastService.mensagemError(erro.error.message);
    })
    .finally(() =>{
      this.isLoading = false;
    });;
  }

async popularMedicao(result: TodasMedicaoProjetoResponse) {
  for (const valor of result?.data ?? []) {
    let existeMedicao = this.medicaoProjetos.find(x => x.numeroMedicao == valor.numeroMedicao);

    if (existeMedicao) {
      existeMedicao.data.push(valor);
    } else {
      try {
        this.todasDocumentosMedicaoProjetoResponse = await this.apiMedicoes.BuscarDocumentosMedicoes(
          this.contratoSelecionado,
          valor.numeroMedicao
        );
      } catch (erro) {
        this._toastService.mensagemError(erro.error.message);
        continue;
      }

      let novoMedicao = new MedicoesModel();
      novoMedicao.numeroMedicao = valor.numeroMedicao;
      novoMedicao.documentos = this.todasDocumentosMedicaoProjetoResponse;
      novoMedicao.data.push(valor);

      this.medicaoProjetos.push(novoMedicao);
    }
  }
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

  async onSelectionChange(nome: string){
    var prefeituraId = this.listaPrefeitura.find(x => x.nome === nome).idPrefeitura;
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
    this.globalService.resetItems();

    this.contratoSelecionadoEstrutura = this.listaContratos.find(x => x.idContrato == this.contratoSelecionado);
    await this.buscarMedicoes();
    this.exibir = true;
    this.cdr.detectChanges();
  }

  limpar(){
    this.selectedPrefeitura = null;  // Limpar o valor selecionado
    this.contratoSelecionado = null;
    this.exibirContrato = false;
    this.exibir = false;
    this.listaFiltrada = this.listaPrefeitura;
    this.cdr.detectChanges();
  }

  openDialog() {
    if(this.todasMedicaoProjetoResponse?.data == undefined){
      var contrato = this.listaContratos.find(x => x.idContrato == this.contratoSelecionado);
      const dialogRef = this.dialog.open(CadastrarMedicaoComponent,{data:{medicoes: contrato, numeroMedicao :1, associarMedicao: false}});

      dialogRef.afterClosed().subscribe(async result => {
        this.isLoading = true;
        if(result){
          await this.apiMedicoes.BuscarMedicoes(result)
          .then((response) => {
            let novoMedicao = new MedicoesModel();
            novoMedicao.numeroMedicao = response.numeroMedicao;
            novoMedicao.data.push(response);
            this.todasMedicaoProjetoResponse.data = [];
            this.todasMedicaoProjetoResponse.data.push(response) ;
            this.medicaoProjetos.push(novoMedicao);
          });
        }
        this.isLoading = false;
      });
    }
    else{
      var numeroMedicao = this.todasMedicaoProjetoResponse.data.sort((a, b) => {
        return b.numeroMedicao - a.numeroMedicao;  // Ordem decrescente
      });

      const maiorNumero = numeroMedicao[0].numeroMedicao + 1;

      const dialogRef = this.dialog.open(CadastrarMedicaoComponent,{data:{medicoes: this.todasMedicaoProjetoResponse.data[0].contratos , numeroMedicao :maiorNumero }});

      dialogRef.afterClosed().subscribe(async result => {
        this.isLoading = true;
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
        this.isLoading = false;
      });
    }
  }

  async openDialogAssociate(numeroMedicao: number, projetosMedidos: MedicoesResponse[]) {
    let medicoes = new TodasMedicaoProjetoResponse();
    medicoes.data = [{
      numeroMedicao: numeroMedicao,
      idContrato: this.contratoSelecionado,
      items: [],
  }] as MedicoesResponse[];

    var medicoesRequest : MedicoesRequest = new MedicoesRequest();
    medicoesRequest.idContrato = this.contratoSelecionado;
    medicoesRequest.itemsPorPagina = 1000000;
    medicoesRequest.pagina = 1;

    if(this.todasMedicaoProjetoResponse.data == undefined){
      this.isLoading = true;
      await this.apiMedicoes.BuscarTodasMedicoes(medicoesRequest)
      .then((result) => {
        this.todasMedicaoProjetoResponse = result;
      }).catch((erro) => {
        this._toastService.mensagemError(erro.error.message);
      }).finally(() =>{
        this.isLoading = false;
      })
    }

    const dialogRef = this.dialog.open(CadastrarMedicaoComponent,{data:{medicoes: this.todasMedicaoProjetoResponse.data[0].contratos, numeroMedicao :numeroMedicao, projetosMedidos: projetosMedidos, associarMedicao: true}});
    dialogRef.afterClosed().subscribe(async result => {
      this.isLoading = true;
      if(result){
        /*await this.apiMedicoes.BuscarMedicoes(result)
        .then((response) => {
          let novoMedicao = new MedicoesModel();
          novoMedicao.numeroMedicao = response.numeroMedicao;
          novoMedicao.data.push(response);

          this.medicaoProjetos.push(novoMedicao);
        });*/
        await this.buscar();
      }
      this.isLoading = false;
    });
  }

  filtrarPrefeitura(valor: string) {
    // Filtra a lista com base no valor digitado
    this.listaFiltrada = this.listaPrefeitura.filter(prefeitura =>
      prefeitura.nome.toLowerCase().includes(valor.toLowerCase())
    );
  }

  // Função chamada quando o valor do campo de entrada mudar
  onOptionSelected(value: any) {
    console.log('Prefeitura selecionada:', value);
  }

  async adicionarDocumento(medicoes: MedicoesModel, documentoInput: HTMLInputElement){
    this.isLoading = true;

    if(documentoInput.files[0] != undefined){
      const documentoFile = documentoInput.files[0] as File;

      var request = new RegistroDocumentosPorMedicoesRequest();
      request.IdContrato = this.contratoSelecionado;
      request.NumeroMedicao = medicoes.numeroMedicao;
      request.Arquivos = (documentoFile);
      await this.apiMedicoes.RegistrarDocumentosMedicaoGlobal(request)
      .then((result) => {

        var addArqMedicao = new IdsResponse();
        addArqMedicao.arquivo = documentoFile.name;
        addArqMedicao.arquivoMedicao = result.ids[0].arquivoMedicao;
        addArqMedicao.id = result.ids[0].id;
        medicoes.documentos.data.push(addArqMedicao);
      })
      .catch(() =>
      {
        this.isLoading = false;
      });


      documentoInput.value = '';
      this.documentoInput.nativeElement.value = '';
    }
    this.isLoading = false;
  }

  async deletarDocumentoMedicao(idDocumento: number, medicoes: MedicoesModel) {
    this.isLoading = true;
    // Filtra os documentos, removendo o que for igual ao item a ser deletado
    await this.apiMedicoes.DeletarArquivoMedicaoGlobal(idDocumento)
    .then(async (result) => {
      this._toastService.mensagemSuccess("Documento deletado com sucesso.");
      //this.arquivosAnexadosTelaMedicao = this.arquivosAnexadosTelaMedicao.filter(x => x.id != idDocumento);
      const index = medicoes.documentos.data.findIndex(doc => doc.id == idDocumento);
      if (index !== -1) {
        medicoes.documentos.data.splice(index, 1);
      }
    })
    .catch(() =>
    {
      this._toastService.mensagemSuccess("Erro ao deletar documento.");
    })
    .finally(()=>{
      this.isLoading = false;
    });
  }

  async downloadDocumentoMedicao(idDocumento: number, arquivo:string) {
    this.isLoading = true;
    // Filtra os documentos, removendo o que for igual ao item a ser deletado
    await this.apiMedicoes.DownloadArquivoMedicaoGlobal(idDocumento)
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


  associarProjetoOutraMedicao(numeroMedicao: number, medicoes: MedicoesModel){
    const dialogRef = this.dialog.open(ModalReaproveitarMedicaoComponent, {
      data: {
        medicoesProjetos: this.medicaoProjetos,
        numeroMedicao: numeroMedicao,
        projetos: medicoes.data // Substitua pelo ID do contrato atual
      },
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        await this.buscar()
      }
    });
  }

  async deletarMedicao(medicoes: MedicoesModel) {
    const existeMedicaoAprovada = medicoes.data.some(x => x.idStatusMedicao == StatusMedicaoEnum.Aprovada);
    let medicaoDeletada = false;

    if (!existeMedicaoAprovada) {
      this.isLoading = true;

      for (const x of medicoes.data) {
        try {
          const result = await this.apiMedicoes.DeletarMedicao(x.idMedicoesProjeto);
          if (result) {
            medicaoDeletada = true;
          }
        } catch (erro) {
          this._toastService.mensagemError(erro.error.message);
          this.isLoading = false;
          return;
        }
      }

      if (medicaoDeletada) {
        this._toastService.mensagemSuccess("Sucesso ao deletar medições de projetos com status diferentes de aprovadas");
        this.medicaoProjetos = [];
        await this.buscar();
      }

      this.isLoading = false;
    } else {
      this._toastService.mensagemError("Não pode deletar medição que possui projetos com status aprovados.");
    }
  }


  async enviar(numeroMedicao: number) {
    const result = window.confirm('Você deseja enviar a medição?');
    if (!result) return;

    this.isLoading = true;
    var medicoesZeradas = false;

    try {
      const projetosPorMedicao = this.medicaoProjetos.filter(x => x.numeroMedicao === numeroMedicao);
      const promessasEnvio: Promise<void>[] = [];

      for (const item of projetosPorMedicao) {
        for (const data of item.data) {
          if (
            data.idStatusMedicao === StatusMedicaoEnum.Recusada ||
            data.idStatusMedicao === StatusMedicaoEnum.EmEdicao ||
            data.idStatusMedicao === StatusMedicaoEnum.Criada
          ) {

            const items = this.medicaoProjetos
              .find(x => x.data.some(y => y.idMedicoesProjeto === data.idMedicoesProjeto))
              ?.data.find(y => y.idMedicoesProjeto === data.idMedicoesProjeto)
              ?.items;

            const todosUnidadeIgual0 = items.every(data => data.unidade == 0);

            if(!todosUnidadeIgual0){

              const req = new BuscarArquivosMedicaoIdProjRequest();
              req.IdMedicoesProjeto = data.idMedicoesProjeto;

              const promessa = this.apiMedicoes.EnviarMedicaoCliente(req)
                .then((result) => {
                  if (result.isSucesso) {
                    // Atualiza o status da medição
                    data.statusMedicao.idStatusMedicao = 4;
                    data.statusMedicao.nome = "Enviada";
                    this._toastService.mensagemSuccess("Medição enviada com sucesso");
                  } else {
                    this._toastService.mensagemError(result.mensagemErro);
                  }
                })
                .catch((erro) => {
                  this._toastService.mensagemError(erro.error.message);
                });

              promessasEnvio.push(promessa);
            }
            else{
              medicoesZeradas = true;
            }
          }
        }
      }

      if(!medicoesZeradas){
        if (promessasEnvio.length === 0) {
          this._toastService.mensagemSuccess("Foram enviados somente casos com status de editados e criados");
        }
      }else{
          this._toastService.mensagemError("Não é possivel enviar uma medição toda zerada.");
      }

      // Aguarda todas as chamadas de envio
      await Promise.all(promessasEnvio);

    } finally {
      this.isLoading = false;
    }
  }


  async openDialogConsolidado(medicao: MedicoesModel[]){
    this.isLoading = true;

    medicao = medicao
      .map(x => ({
        ...x,
        data: x.data.filter(y => y.idStatusMedicao !== StatusMedicaoEnum.Recusada)
      }))
      .filter(x => x.data.length > 0);

    await this.api.BuscarContrato(this.contratoSelecionado).then((result) => {
      if(medicao.some(z => z.data)){
        medicao[0].data[0].contratos.valorSaldoRestante = result?.valorSaldoRestante;
        medicao[0].data[0].contratos.valorTotalMedido = result?.valorTotalMedido;
        medicao[0].data[0].contratos.valorTotalPrevisto = result?.valorTotalPrevisto;
        medicao[0].data[0].contratos.valorTotalSolicitado = result?.valorTotalSolicitado;
      }
      this.isLoading = false;

      this.dialog.open(ResumoMedicaoComponent,{data:
        medicao
      });
    })
  }

  closeAllAccordions() {
    this.accordions.toArray().forEach(acc => acc.closeAll());
  }

  openAllAccordions() {
    this.accordions.toArray().forEach(acc => acc.openAll());
  }
}
