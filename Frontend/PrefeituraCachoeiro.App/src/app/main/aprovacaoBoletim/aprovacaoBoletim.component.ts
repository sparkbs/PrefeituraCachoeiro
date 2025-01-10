import { Component, OnInit } from '@angular/core';
import { BuscarContratosRequest } from 'src/app/request/ContratoRequest/buscarContratosRequest';
import { ProjetoRequest } from 'src/app/request/ProjetoRequest/projetoRequest';
import { ContratosResponse } from 'src/app/response/contratosResponse/todosContratosResponse';
import { ProjetoResponse } from 'src/app/response/projetoResponse/projetoResponse';
import { ContratosService } from 'src/app/services/contratos.service';
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
  showProjetos: boolean = false;
  constructor(private readonly api: ContratosService,public _projetoControllerService: ProjetoService) { }

  async ngOnInit() {
    await this.buscarListaContratos(1);
  }

  async buscar(contratoId: number){
    await this.getAllProjects(contratoId);
    this.showProjetos = true;
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
