import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BoletimComponent } from './boletim.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { BoletimMedicaoComponent } from './boletim-medicao/boletim-medicao.component';
import { BoletimProjetoComponent } from './boletim-projeto/boletim-projeto.component';
import { BoletimDetalhadoComponent } from './boletim-detalhado/boletim-detalhado.component';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ BoletimComponent, BoletimMedicaoComponent, BoletimProjetoComponent, BoletimDetalhadoComponent ],
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    RouterModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class BoletimModule {}
