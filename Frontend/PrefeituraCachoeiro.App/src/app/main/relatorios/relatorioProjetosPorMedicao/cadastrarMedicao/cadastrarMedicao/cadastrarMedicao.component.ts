import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cadastrarMedicao',
  templateUrl: './cadastrarMedicao.component.html',
  styleUrls: ['./cadastrarMedicao.component.scss']
})
export class CadastrarMedicaoComponent implements OnInit {
  isNovaMedicao = false;
  isInserirNovoProjeto = false;

  constructor() { }

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
}
