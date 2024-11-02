import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IncluirEditarMedicaoComponent } from '../incluir-editar-medicao/incluir-editar-medicao.component';

@Component({
  selector: 'app-incluir-editar-projeto',
  templateUrl: './incluir-editar-projeto.component.html',
  styleUrls: ['./incluir-editar-projeto.component.scss']
})
export class IncluirEditarProjetoComponent {

  constructor(public dialog: MatDialog){}

  openDialog(edicao: boolean = false): void {
    const dialogRef = this.dialog.open(IncluirEditarMedicaoComponent, {
      width: window.innerWidth >= 1450 ? '50%' : '50%',
      data: { edicao }
    });
  }
}
