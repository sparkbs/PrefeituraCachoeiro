import { Component, OnInit } from '@angular/core';
import { BuscarContratosRequest } from 'src/app/request/ContratoRequest/buscarContratosRequest';
import { MedicoesRequest } from 'src/app/request/MedicoesRequest/medicoesRequest';
import { ProjetoRequest } from 'src/app/request/ProjetoRequest/projetoRequest';
import { ContratosResponse } from 'src/app/response/contratosResponse/todosContratosResponse';
import { MedicoesModel, Projeto, TodasMedicaoProjetoResponse } from 'src/app/response/medicoesResponse/medicoesResponse';
import { ProjetoResponse } from 'src/app/response/projetoResponse/projetoResponse';
import { ContratosService } from 'src/app/services/contratos.service';
import { MedicoesService } from 'src/app/services/medicoes.service';
import { ProjetoService } from 'src/app/services/projeto.service';

@Component({
  selector: 'app-aprovacaoBoletim',
  templateUrl: './aprovacaoBoletim.component.html',
  styleUrls: ['./aprovacaoBoletim.component.scss']
})
export class AprovacaoBoletimComponent implements OnInit {
  contratoSelecionado = 0;
  listaContratos: ContratosResponse[] = [];
  listaProjetos: ProjetoResponse[] = [];
  medicaoProjetos : MedicoesModel[] = [];
  showProjetos: boolean = false;
  constructor(private readonly api: ContratosService,public _projetoControllerService: ProjetoService,private readonly apiMedicoes: MedicoesService) { }

  async ngOnInit() {
    await this.buscarListaContratos(1);
  }

  async buscar(contratoId: number){
    await this.buscarMedicoes();
    this.showProjetos = true;
  }

  async buscarMedicoes(){
    this.medicaoProjetos = [];
    var medicoesRequest : MedicoesRequest = new MedicoesRequest();
    medicoesRequest.idContrato = this.contratoSelecionado;
    medicoesRequest.itemsPorPagina = 1000000;
    medicoesRequest.pagina = 1;
    await this.apiMedicoes.BuscarTodasMedicoes(medicoesRequest)
    .then((result) => {      
      this.popularMedicao(result);
    }).catch(() => {
    })
    .finally(() =>{
    });;
  }

  nomeProjeto(id:number, projetos: Projeto[]){
    return projetos.find(x => x.idProjeto == id ).nomeProjeto;
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
