import { ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {MatAccordion} from '@angular/material/expansion';

@Component({
  selector: 'app-relatorioProjetosPorMedicao',
  templateUrl: './relatorioProjetosPorMedicao.component.html',
  styleUrls: ['./relatorioProjetosPorMedicao.component.scss']
})
export class RelatorioProjetosPorMedicaoComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  exibir = false;
  alterarMedicaoProjeto1 = false;
  alterarMedicaoProjeto2 = false;
  alterarMedicaoProjeto3 = false;

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit() {
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
}
