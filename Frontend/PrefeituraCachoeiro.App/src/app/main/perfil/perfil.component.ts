import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.scss']
})
export class PerfilComponent {
  visiblePerfis: boolean = false;

  constructor(public dialog: MatDialog){}

  openDialog(): void {
  }

  openPerfis() {
    this.visiblePerfis = !this.visiblePerfis;
  }
}
