import { Component } from '@angular/core';
import { CONFIG_BASE_DADOS, CONFIG_GRUPOS_PERMISSOES, CONFIG_PERFIS } from 'src/app/_constants/configuracoes';


@Component({
  selector: 'app-configuracoes',
  templateUrl: './configuracoes.component.html',
  styleUrls: ['./configuracoes.component.scss']
})
export class ConfiguracoesComponent {
  showConfig: number = 0;

  openConfig(tela: number) {
    switch(tela) {
      case CONFIG_BASE_DADOS:
        this.showConfig = CONFIG_BASE_DADOS;
        break;
      case CONFIG_PERFIS:
        this.showConfig = CONFIG_PERFIS;
        break;
      case CONFIG_GRUPOS_PERMISSOES:
        this.showConfig = CONFIG_GRUPOS_PERMISSOES;
        break;
      default:
    }
  }
}
