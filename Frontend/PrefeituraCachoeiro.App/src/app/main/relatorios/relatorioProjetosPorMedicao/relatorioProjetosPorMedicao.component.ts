import { ChangeDetectorRef, Component, inject, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatAccordion} from '@angular/material/expansion';
import { CadastrarMedicaoComponent } from './cadastrarMedicao/cadastrarMedicao/cadastrarMedicao.component';
import { ContratosService } from 'src/app/services/contratos.service';
import { BuscarContratosRequest } from 'src/app/request/ContratoRequest/buscarContratosRequest';
import { PrefeituraFilter, PrefeituraResponse } from 'src/app/response/prefeituraResponse/prefeituraResponse';
import { PrefeituraService } from 'src/app/services/prefeitura.service';
import { ContratosResponse } from 'src/app/response/contratosResponse/todosContratosResponse';

@Component({
  selector: 'app-relatorioProjetosPorMedicao',
  templateUrl: './relatorioProjetosPorMedicao.component.html',
  styleUrls: ['./relatorioProjetosPorMedicao.component.scss']
})
export class RelatorioProjetosPorMedicaoComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  listaPrefeitura: PrefeituraResponse[] = [];
  listaContratos: ContratosResponse[] = [];

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  exibir = false;
  alterarMedicaoProjeto1 = false;
  alterarMedicaoProjeto2 = false;
  alterarMedicaoProjeto3 = false;
  exibirContrato = false;

  constructor(private cdr: ChangeDetectorRef, 
    private readonly apiPrefeitura: PrefeituraService,
    private readonly api: ContratosService) { }

  async ngOnInit() {
    await this.buscarListaPrefeituras();
  }

  async buscarListaPrefeituras(){
    var prefeituraFilter : PrefeituraFilter = new PrefeituraFilter();
    prefeituraFilter.nome = "";
    prefeituraFilter.itemsPorPagina = 10;
    prefeituraFilter.pagina = 1;
    await this.apiPrefeitura.BuscarTodasPrefeituras(prefeituraFilter)
    .then((result) => {
      this.listaPrefeitura = result.data;
    });
  }

  async onSelectionChange(prefeituraId: number){
    this.exibirContrato = true;
    await this.buscarListaContratos(prefeituraId);
  }

  async buscarListaContratos(prefeituraId: number){
    var contratosFilter : BuscarContratosRequest = new BuscarContratosRequest();
    contratosFilter.itemsPorPagina = 10;
    contratosFilter.IdProjeto = null;
    contratosFilter.pagina = 1;
    await this.api.BuscarTodosContratos(contratosFilter)
    .then((result) => {
      this.listaContratos = result.data.filter(x => x.prefeituraId == prefeituraId);
    });
  }

  buscar(){
    this.exibir = true;
    this.cdr.detectChanges();
  }

  limpar(){
    this.exibir = false;
    this.cdr.detectChanges();
  }

  editProjeto1(){
    this.alterarMedicaoProjeto1 = !this.alterarMedicaoProjeto1;
  }

  editProjeto2(){
    this.alterarMedicaoProjeto2 = !this.alterarMedicaoProjeto2;
  }

  editProjeto3(){
    this.alterarMedicaoProjeto3 = !this.alterarMedicaoProjeto3;
  }
  
  openDialog() {
    this.dialog.open(CadastrarMedicaoComponent);    
  }
}
