import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';  // Caminho correto para o componente
import { ConfirmaExclusaoComponent } from './confirma-exclusao/confirma-exclusao.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ConfirmaModalComponent } from './confirma-modal/confirma-modal.component';

@NgModule({
  declarations: [LoadingComponent, ConfirmaExclusaoComponent, ConfirmaModalComponent],
  imports: [CommonModule, MatDialogModule,MatButtonModule],
  exports: [LoadingComponent, ConfirmaExclusaoComponent]  // Exporte para que outros módulos possam usá-lo
})
export class SharedModule { }
