import { ChangeDetectorRef, Component, inject, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {MatAccordion} from '@angular/material/expansion';
import { CadastrarMedicaoComponent } from './cadastrarMedicao/cadastrarMedicao/cadastrarMedicao.component';
import { ContratosService } from 'src/app/services/contratos.service';
import { BuscarContratosRequest } from 'src/app/request/ContratoRequest/buscarContratosRequest';

@Component({
  selector: 'app-relatorioProjetosPorMedicao',
  templateUrl: './relatorioProjetosPorMedicao.component.html',
  styleUrls: ['./relatorioProjetosPorMedicao.component.scss']
})
export class RelatorioProjetosPorMedicaoComponent implements OnInit {
  readonly dialog = inject(MatDialog);

  @ViewChild(MatAccordion) accordion!: MatAccordion;
  exibir = false;
  alterarMedicaoProjeto1 = false;
  alterarMedicaoProjeto2 = false;
  alterarMedicaoProjeto3 = false;
  exibirContrato = false;

  constructor(private cdr: ChangeDetectorRef, private readonly api: ContratosService) { }

  async ngOnInit() {
    await this.buscarListaContratos();
  }

  onSelectionChange(){
    this.exibirContrato = true;
  }

  async buscarListaContratos(){
    await this.api.BuscarTodosContratos(new BuscarContratosRequest())
    .then((result) => {
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
