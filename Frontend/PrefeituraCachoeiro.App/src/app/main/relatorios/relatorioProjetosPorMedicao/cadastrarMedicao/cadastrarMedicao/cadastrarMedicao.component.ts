import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PermissoesRequest } from 'src/app/request/PermissoesRequest/permissoesRequest';
import { TodasMedicaoProjetoResponse } from 'src/app/response/medicoesResponse/medicoesResponse';
import { PermissaoService } from 'src/app/services/permissao.service';

@Component({
  selector: 'app-cadastrarMedicao',
  templateUrl: './cadastrarMedicao.component.html',
  styleUrls: ['./cadastrarMedicao.component.scss']
})
export class CadastrarMedicaoComponent implements OnInit {
  isNovaMedicao = false;
  isInserirNovoProjeto = false;
  projetoSelecionado = 0;
  nomeMedicao = 0;

  constructor(private readonly api: PermissaoService,@Inject(MAT_DIALOG_DATA) public data: TodasMedicaoProjetoResponse) { }

  ngOnInit() {
  }

  novaMedicao(){
    this.isNovaMedicao = true;
  }

  inserirProjetoEmMedicao(){
    this.isInserirNovoProjeto = true;
  }

  voltarTelaCriarMedicaoOuProjeto(){
    if(this.isInserirNovoProjeto){
      this.isInserirNovoProjeto = false;
    }
    if(this.isNovaMedicao){
      this.isNovaMedicao = false;
    }
  }

  async criarNovaMedicao(){
    let permissoesRequest = new PermissoesRequest();
    this.data.data[0].contratos.items.forEach(x => {
      x.idContrato = this.data.data[0].idContrato;
    });
    
    permissoesRequest.dataMedicao = new Date();
    permissoesRequest.idContrato = this.data.data[0].idContrato;
    permissoesRequest.idProjeto = this.projetoSelecionado;
    permissoesRequest.items = this.data.data[0].contratos.items.map(item => ({
      idItemContrato: item.idItemContrato,
      unidade: item.unidade
    }));    
    permissoesRequest.numeroMedicao = this.nomeMedicao;    

    await this.api.CriarPermissoes(permissoesRequest)
    .then((result) => {     
      console.log(result);   
    });
  }
}
