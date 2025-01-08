import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

export interface PeriodicElement {
  nome: string;
  medicao1: number;
  medicao2: number;
  medicao3: number;
  medicao4: number;
  medicao5: number;
  medicao6: number;
  medicao7: number;
  medicao8: number;
  medicao9: number;
  medicao10: number;
  medicao11: number;
  medicao12: number;
  medicaoRestante: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { nome: 'Projetista Junior', medicao1: 15, medicao2: 23, medicao3: 1, medicao4: 3, medicao5: 4, medicao6: 5, medicao7: 12, medicao8: 42, medicao9: 13, medicao10: 23, medicao11: 34, medicao12: 54, medicaoRestante: 30},
  { nome: 'Técnico Sênior',  medicao1: 15, medicao2: 23, medicao3: 1, medicao4: 3, medicao5: 4, medicao6: 5, medicao7: 12, medicao8: 42, medicao9: 13, medicao10: 23, medicao11: 34, medicao12: 54, medicaoRestante: 30},
  { nome: 'Projeto Elétrico', medicao1: 15, medicao2: 23, medicao3: 1, medicao4: 3, medicao5: 4, medicao6: 5, medicao7: 12, medicao8: 42, medicao9: 13, medicao10: 23, medicao11: 34, medicao12: 54, medicaoRestante: 30, },
];

@Component({
  selector: 'app-modalLevantamento',
  templateUrl: './modalLevantamento.component.html',
  styleUrls: ['./modalLevantamento.component.scss']
})
export class ModalLevantamentoComponent implements OnInit {
  displayedColumns: string[] = ['nome', 'medicao1', 'medicao2', 'medicao3', 'medicao4', 'medicao5', 'medicao6', 'medicao7', 'medicao8', 'medicao9', 'medicao10', 'medicao11', 'medicao12', 'medicaoRestante' ];
  projetos: string[] = [
      'projeto1',
    ];
  form: FormGroup;

  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.createForm();
    this.dataSource.paginator = this.paginator;
  }

  createForm() {
    this.form = this.fb.group({
          projeto: ['', [Validators.required]],
        });
  }

}
