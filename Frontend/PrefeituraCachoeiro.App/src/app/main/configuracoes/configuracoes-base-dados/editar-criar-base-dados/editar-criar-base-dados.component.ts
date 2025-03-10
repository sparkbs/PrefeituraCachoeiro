import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-criar-base-dados',
  templateUrl: './editar-criar-base-dados.component.html',
  styleUrls: ['./editar-criar-base-dados.component.scss']
})
export class EditarCriarBaseDadosComponent implements OnInit {
  form: FormGroup;
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { edicao: boolean },
    public dialogRef: MatDialogRef<EditarCriarBaseDadosComponent>,
    private fb: FormBuilder
  ){}

  ngOnInit(): void {
    this.form = this.fb.group({
      descricao: ['', [Validators.required]],
      origem: ['', [Validators.required]],
      unidade: ['', [Validators.required]],
      quantidade: ['', [Validators.required]],
      valorSemBdi: ['', [Validators.required]],
      valorComBdi: ['', [Validators.required]],
      valor: ['', [Validators.required]]
    });
  }


}
