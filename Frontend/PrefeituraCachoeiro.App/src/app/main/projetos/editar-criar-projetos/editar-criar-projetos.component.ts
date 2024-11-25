import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-criar-projetos',
  templateUrl: './editar-criar-projetos.component.html',
  styleUrls: ['./editar-criar-projetos.component.scss']
})
export class EditarCriarProjetosComponent implements OnInit {
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

  constructor(
    public dialogRef: MatDialogRef<EditarCriarProjetosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { edicao: boolean },
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', [Validators.required]],
      contrato: ['', [Validators.required]],
      prefeitura: ['', [Validators.required]]
    });
  }

  saveForm() {

  }
}
