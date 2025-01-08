import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalLevantamentoComponent } from './modalLevantamento.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatTooltipModule,
    MatSelectModule,
    MatPaginatorModule,
    MatTableModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule
  ],
  declarations: [ModalLevantamentoComponent]
})
export class ModalLevantamentoModule { }
