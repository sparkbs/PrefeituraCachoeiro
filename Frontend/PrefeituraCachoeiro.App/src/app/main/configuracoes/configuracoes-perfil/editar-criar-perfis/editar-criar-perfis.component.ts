import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TablePerfis } from '../tabela-perfis/tabela-perfis.component';

@Component({
  selector: 'app-editar-criar-perfis',
  templateUrl: './editar-criar-perfis.component.html',
  styleUrls: ['./editar-criar-perfis.component.scss']
})
export class EditarCriarPerfisComponent implements OnInit {
  grupos: string[] = [
    'gerente',
    'usuario',
    'administrador'
  ];
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EditarCriarPerfisComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { edicao: boolean, perfilSend: TablePerfis },
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      senha: ['', [Validators.required]],
      grupo: ['', [Validators.required]]
    });

    if (this.data.edicao) {
      this.form.get('name').setValue(this.data.perfilSend.name);
      this.form.get('email').setValue(this.data.perfilSend.email);
      this.form.get('grupo').setValue(this.data.perfilSend.grupo);
      this.form.get('senha')?.disable();
    }
    else {
      this.form.get('senha')?.enable();
    }
  }

  saveForm() {
    debugger
    if (this.form.invalid) {
      return;
    }

    const perfis: TablePerfis = {
      id: 0,
      name: this.form.get('name').value,
      email: this.form.get('email').value,
      grupo: this.form.get('grupo').value
    }

    this.dialogRef.close(perfis);
  }
}
