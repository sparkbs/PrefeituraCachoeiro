import { Component, inject, OnInit } from '@angular/core';
import { BuscarAditivosContrato, BuscarContratosRequest } from 'src/app/request/ContratoRequest/buscarContratosRequest';
import { DadosMedicoesRequest, MedicoesRequest } from 'src/app/request/MedicoesRequest/medicoesRequest';
import { ProjetoRequest } from 'src/app/request/ProjetoRequest/projetoRequest';
import { ArquivosContratoResponse, ContratosResponse } from 'src/app/response/contratosResponse/todosContratosResponse';
import { ArquivosAprovacao, ArquivosMedicoesProjetoResponse, IdsResponse, MedicoesModel, MedicoesResponse, Projeto, TodasMedicaoProjetoResponse } from 'src/app/response/medicoesResponse/medicoesResponse';
import { ProjetoResponse } from 'src/app/response/projetoResponse/projetoResponse';
import { ContratosService } from 'src/app/services/contratos.service';
import { MedicoesService } from 'src/app/services/medicoes.service';
import { ProjetoService } from 'src/app/services/projeto.service';
import { AprovarMedicaoComponent } from './aprovarMedicao/aprovarMedicao.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from 'src/app/services/toast.service';
import { Router } from '@angular/router';
import { PrefeituraResponse, PrefeituraFilter } from 'src/app/response/prefeituraResponse/prefeituraResponse';
import { PrefeituraService } from 'src/app/services/prefeitura.service';
import { StatusMedicaoEnum } from 'src/app/enums/statusMedicao';
import { AuthService } from 'src/app/services/auth.service';
import { AESEncryptDecriptService } from 'src/app/shared/aesEncryptDecript.service';
import { VerDocumentosComponent } from './verDocumentos/verDocumentos.component';
import { PerfilLogin } from 'src/app/enums/perfilLogin';

@Component({
  selector: 'app-aprovacaoBoletim',
  templateUrl: './aprovacaoBoletim.component.html',
  styleUrls: ['./aprovacaoBoletim.component.scss']
})
export class AprovacaoBoletimComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  isLoading = false;
  contratoSelecionado = 0;
  listaContratos: ContratosResponse[] = [];
  listaProjetos: ProjetoResponse[] = [];
  medicaoProjetos : MedicoesModel[] = [];
  showProjetos: boolean = false;
  listaPrefeitura: PrefeituraResponse[] = [];
  selectedPrefeitura: number | null = null; // Valor selecionado
  exibirContrato = false;
  contrato: ContratosResponse;

  constructor(private readonly apiPrefeitura: PrefeituraService,
    private auth: AuthService, 
    private readonly api: ContratosService,
    public _projetoControllerService: ProjetoService,
    private readonly apiMedicoes: MedicoesService,
    private _toastService: ToastService, 
    private router: Router,
    private readonly aesEncryptDecript: AESEncryptDecriptService
  ) { }

  async ngOnInit() {
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

    //await this.buscarListaContratos(21);
  }

  async onSelectionChange(prefeituraId: number){
    this.exibirContrato = true;
    this.isLoading = true;
    await this.buscarListaContratos(prefeituraId);
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
    .catch((erro) => {
      this._toastService.mensagemError(erro.error.message);
    })
    .finally(() =>{
      this.isLoading = false;
    });
  }

  async buscarPrefeitura(id: number){
    await this.apiPrefeitura.BuscarPrefeitura(id)
    .then((result) => {
      this.listaPrefeitura = [];
      this.listaPrefeitura.push(result);
    })
    .catch((erro) => {
      this._toastService.mensagemError(erro.error.message);
    })
    .finally(() =>{
      this.isLoading = false;
    });
  }

  async buscar(contratoId: number){
    this.contrato = this.listaContratos.find(x => x.idContrato == contratoId);

    this.isLoading = true;
    await this.buscarMedicoes();
    this.showProjetos = true;
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

  openBoletimDetalhado(idCliente: number,idContrato: number,idProjeto: number, idMedicao: number) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/main/boletimPorProjeto',idCliente,idContrato, idProjeto, idMedicao])
    );
    window.open(url, '_blank');  // Abre em uma nova guia
  }


  async buscarMedicoes(){
    this.medicaoProjetos = [];
    var medicoesRequest : MedicoesRequest = new MedicoesRequest();
    medicoesRequest.idContrato = this.contratoSelecionado;
    medicoesRequest.itemsPorPagina = 1000000;
    medicoesRequest.pagina = 1;
    await this.apiMedicoes.BuscarTodasMedicoes(medicoesRequest)
    .then((result) => {      
      result.data = result.data.filter(x => x.idStatusMedicao == StatusMedicaoEnum.Enviada);
      if(result.data && result.data.length > 0){
        this.popularMedicao(result);
      }else{
        this._toastService.mensagemError("Não existe medição para avaliação!");
      }
    }).catch((erro) => {
      this._toastService.mensagemError(erro.error.message);
    })
    .finally(() =>{
      this.isLoading = false;
    });;
  }

  async openModalVerAnexo(arquivosContrato: ArquivosContratoResponse[], numeroMedicao: number){    
    this.isLoading = true
    var arquivoVisualizacao: ArquivosAprovacao = new ArquivosAprovacao();
    var todasDocumentosMedicaoProjetoResponse = await this.apiMedicoes.BuscarDocumentosMedicoes(
          this.contratoSelecionado,
          numeroMedicao
        );

    arquivoVisualizacao.arquivosMedicoesProjetoResponse = todasDocumentosMedicaoProjetoResponse.data;
    arquivoVisualizacao.arquivosContratosResponse = this.contrato.arquivosContratos;

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

  /*async reprovarMedicao(idMedicao: number, medicao: MedicoesResponse){
    this.isLoading = true;
    let request = new DadosMedicoesRequest()
    request.DataRegistro = new Date().toISOString().split('T')[0]; 
    request.Resumo = medicao.resumo;
    request.IdMedicoesProjeto = idMedicao;
    await this.apiMedicoes.ReprovarMedicoes(request)
    .then(async (result) => {     
      if(result.isSucesso){
        this._toastService.mensagemSuccess("Sucesso ao reprovar medição.");
        await this.buscar(this.contratoSelecionado)
        .then(() =>{
          this._toastService.mensagemSuccess("Medições atualizadas com sucesso!");
        })
        .catch((res) =>{
          this._toastService.mensagemError(res.error.message);
        })
        .finally(() =>{
          this.isLoading = false;
        });
      }
      else{
        this._toastService.mensagemError(result.mensagemErro);
      }
    })
    .catch((ex) => {
      this._toastService.mensagemError(ex?.error?.message);
    })
    .finally(() =>{
      this.isLoading = false;
    });
  }*/
  
  async aprovarMedicao(idMedicao: number, medicao: MedicoesResponse) {
    const dialogRef = this.dialog.open(AprovarMedicaoComponent, {
      data: { idMedicoesProj: idMedicao, medicao: medicao, reprovado: false }
    });
  
    dialogRef.afterClosed().subscribe(async (resultado) => {
      if (resultado) {
        this._toastService.mensagemSuccess("Aguarde, atualizando as medições!");
        this.isLoading = true;
  
        await this.buscar(this.contratoSelecionado)
          .then(() => {
            this._toastService.mensagemSuccess("Atualizado com sucesso!");
          })
          .catch((res) => {
            this._toastService.mensagemError(res.error.message);
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    });
  }


  async ReprovarMedicaoModal(idMedicao: number, medicao: MedicoesResponse) {
    const dialogRef = this.dialog.open(AprovarMedicaoComponent, {
      data: { idMedicoesProj: idMedicao, medicao: medicao, reprovado: true }
    });
  
    dialogRef.afterClosed().subscribe(async (resultado) => {
      if (resultado) {
        this._toastService.mensagemSuccess("Aguarde, atualizando as medições!");
        this.isLoading = true;
  
        await this.buscar(this.contratoSelecionado)
          .then(() => {
            this._toastService.mensagemSuccess("Atualizado com sucesso!");
          })
          .catch((res) => {
            this._toastService.mensagemError(res.error.message);
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    });
  }
  
  async aprovarTodasMedicoes(todasMedicoes: MedicoesResponse[]) {
  
    const dialogRef = this.dialog.open(AprovarMedicaoComponent, {
      data: { idMedicoesProj: 0, todasMedicoes: todasMedicoes }
    });
  
    dialogRef.afterClosed().subscribe(async (resultado) => {
      if (resultado) {
        // Aqui você trata o valor retornado do dialog, se necessário
  
        this._toastService.mensagemSuccess("Aguarde, atualizando as medições!");
        this.isLoading = true;
  
        await this.buscar(this.contratoSelecionado)
          .then(() => {
            this._toastService.mensagemSuccess("Atualizado com sucesso!");
          })
          .catch((res) => {
            this._toastService.mensagemError(res.error.message);
          })
          .finally(() => {
            this.isLoading = false;
          });
      }
    });
  }  

  nomeProjeto(id:number, projetos: Projeto[]){
    return id == null ? "": projetos?.find(x => x.idProjeto == id )?.nomeProjeto;
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

  async buscarListaContratos(prefeituraId: number){
    var contratosFilter : BuscarContratosRequest = new BuscarContratosRequest();
    contratosFilter.itemsPorPagina = 1000000;
    contratosFilter.IdProjeto = null;
    contratosFilter.pagina = 1;
    await this.api.BuscarTodosContratos(contratosFilter)
    .then((result) => {
      this.listaContratos = result.data.filter(x => x.prefeituraId == prefeituraId);
    })    
    .finally(() =>{
      this.isLoading = false;
     });
  }

   async getAllProjects(contratoId: number) {
    const projetoRequest: ProjetoRequest = {
      nome: '',
      itemsPorPagina: 1000000,
      pagina: 1,
      idContrato: contratoId
    };
 
     await this._projetoControllerService.BuscarTodosProjetos(projetoRequest)
     .then((res) => {
        this.listaProjetos = res.data;
     })
     .catch((erro) => {
       console.error(erro);
     });
   }
}
