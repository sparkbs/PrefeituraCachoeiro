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
}
