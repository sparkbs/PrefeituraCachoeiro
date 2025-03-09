import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

export interface tableRecursos {
  nome: string;
  quantidade: number;
  valor: number;
  acoes?: string;
}

const recursoData: tableRecursos[] = [
  {nome: 'Projeto de GLP', quantidade: 5, valor: 23, acoes: ''},
  {nome: 'Projeto Elétrico', quantidade: 10, valor: 34, acoes: ''},
  {nome: 'Chapa de metal', quantidade: 7, valor: 15, acoes: ''},
];

@Component({
  selector: 'app-editar-criar-projetos',
  templateUrl: './editar-criar-projetos.component.html',
  styleUrls: ['./editar-criar-projetos.component.scss']
})
export class EditarCriarProjetosComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['nome', 'quantidade', 'valor', 'acoes'];
  dataSource = new MatTableDataSource<tableRecursos>(recursoData);
  form: FormGroup;

  prefeituras: string[] = [
    'Cachoeiro',
    'BH',
    'Teste',
  ];

  contratos: string[] = [
    'Contrato 1',
    'Contrato 2',
    'Contrato 3',
  ];

  recursos: string[] = [
    'Projetista Junior',
    'Técnico Senior',
    'Projeto Elétrico'
  ];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialogRef: MatDialogRef<EditarCriarProjetosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { edicao: boolean },
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      contrato: ['', [Validators.required]],
      prefeitura: ['', [Validators.required]],
      recurso: ['', [Validators.required]],
      quantidade: [0, [Validators.required]],
      valor: [0, [Validators.required]]
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  saveForm() {

  }
}
