import { Component } from '@angular/core';
import { EditarDadosComponent } from './editar-dados/editar-dados.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {

  constructor(public dialog: MatDialog){}

  openDialog(): void {
    const dialogRef = this.dialog.open(EditarDadosComponent, {
      width: window.innerWidth >= 1450 ? '50%' : '50%',
      data: {  }
    });
  }
}
