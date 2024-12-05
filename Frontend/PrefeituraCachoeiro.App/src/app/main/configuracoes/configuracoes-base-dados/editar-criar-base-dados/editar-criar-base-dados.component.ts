import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-editar-criar-base-dados',
  templateUrl: './editar-criar-base-dados.component.html',
  styleUrls: ['./editar-criar-base-dados.component.scss']
})
export class EditarCriarBaseDadosComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { edicao: boolean },){}
}
