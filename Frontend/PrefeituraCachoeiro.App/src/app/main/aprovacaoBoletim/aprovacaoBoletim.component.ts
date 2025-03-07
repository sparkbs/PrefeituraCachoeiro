import { Component, inject, OnInit } from '@angular/core';
import { BuscarContratosRequest } from 'src/app/request/ContratoRequest/buscarContratosRequest';
import { DadosMedicoesRequest, MedicoesRequest } from 'src/app/request/MedicoesRequest/medicoesRequest';
import { ProjetoRequest } from 'src/app/request/ProjetoRequest/projetoRequest';
import { ContratosResponse } from 'src/app/response/contratosResponse/todosContratosResponse';
import { ArquivosMedicoesProjetoResponse, MedicoesModel, Projeto, TodasMedicaoProjetoResponse } from 'src/app/response/medicoesResponse/medicoesResponse';
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
    var idPrefeituraUser = this.auth.getCookie("_idPrefeitura");
    
    if(idPrefeituraUser){
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
    .catch(() => {
      this._toastService.mensagemError("Erro ao buscar prefeitura!");
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
    .catch(() => {
      this._toastService.mensagemError("Erro ao buscar prefeitura!");
    })
    .finally(() =>{
      this.isLoading = false;
    });
  }

  async buscar(contratoId: number){
    await this.buscarMedicoes();
    this.showProjetos = true;
  }

  openBoletim(idMedicao: number) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/main/boletimMedicao', this.selectedPrefeitura, this.contratoSelecionado, idMedicao])
    );
    window.open(url, '_blank');  // Abre em uma nova guia
  }

  openBoletimMedicao(idProjeto, idMedicao: number) {
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/main/boletimPorProjeto', idProjeto, idMedicao])
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
    }).catch(() => {
    })
    .finally(() =>{
    });;
  }

  openModalVerAnexo(arquivos: ArquivosMedicoesProjetoResponse[]){
    const dialogRef = this.dialog.open(VerDocumentosComponent,{
      data: arquivos
    });
  }

  async reprovarMedicao(idMedicao: number){
    let request = new DadosMedicoesRequest()
    request.DataRegistro = new Date().toISOString().split('T')[0]; 
    request.Resumo = "";
    request.IdMedicoesProjeto = idMedicao;
    await this.apiMedicoes.ReprovarMedicoes(request)
    .then((result) => {     
      if(result.isSucesso){
        this._toastService.mensagemSuccess("Sucesso ao reprovar medição.");
      }
      else{
        this._toastService.mensagemError(result.mensagemErro);
      }
    })
    .catch((ex) => {
      this._toastService.mensagemError(ex?.error?.message);
    });
  }
  
  aprovarMedicao(idMedicao: number){
    this.dialog.open(AprovarMedicaoComponent,{data:{idMedicoesProj: idMedicao}});
  }

  nomeProjeto(id:number, projetos: Projeto[]){
    return id == null ? "": projetos.find(x => x.idProjeto == id ).nomeProjeto;
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
