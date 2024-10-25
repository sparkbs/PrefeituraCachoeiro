import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { IncluirEditarProjetoComponent } from './incluir-editar-projeto/incluir-editar-projeto.component';

@Component({
  selector: 'app-projetos',
  templateUrl: './projetos.component.html',
  styleUrls: ['./projetos.component.scss']
})
export class ProjetosComponent {

  constructor(public dialog: MatDialog){}

  openDialog(): void {
    const dialogRef = this.dialog.open(IncluirEditarProjetoComponent, {
      width: window.innerWidth >= 1450 ? '50%' : '50%',
      data: { name: 'Nome do Projeto' }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('O diálogo foi fechado');
    });
  }
}
