import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingComponent } from './loading/loading.component';  // Caminho correto para o componente

@NgModule({
  declarations: [LoadingComponent],
  imports: [CommonModule],
  exports: [LoadingComponent]  // Exporte para que outros módulos possam usá-lo
})
export class SharedModule { }
