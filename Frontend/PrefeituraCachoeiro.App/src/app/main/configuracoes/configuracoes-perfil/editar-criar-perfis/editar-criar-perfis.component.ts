import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-criar-perfis',
  templateUrl: './editar-criar-perfis.component.html',
  styleUrls: ['./editar-criar-perfis.component.scss']
})
export class EditarCriarPerfisComponent {
  grupos: string[] = [
    'Gerente',
    'Usuário',
  ];
  constructor(
    public dialogRef: MatDialogRef<EditarCriarPerfisComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { edicao: boolean }
  ) {}
}
