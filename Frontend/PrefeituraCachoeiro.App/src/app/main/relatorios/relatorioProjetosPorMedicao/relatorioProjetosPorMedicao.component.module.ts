import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule} from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { RelatorioProjetosPorMedicaoComponent } from './relatorioProjetosPorMedicao.component';
import { CadastrarMedicaoComponent } from './cadastrarMedicao/cadastrarMedicao/cadastrarMedicao.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ListaMedicaoComponent } from './listaMedicao/listaMedicao/listaMedicao.component';
import { MatTableModule } from '@angular/material/table';
import { ResumoMedicaoComponent } from './resumoMedicao/resumoMedicao/resumoMedicao.component';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [ RelatorioProjetosPorMedicaoComponent, CadastrarMedicaoComponent, ListaMedicaoComponent, ResumoMedicaoComponent],
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatCardModule,
    MatTabsModule,
    MatListModule,    
    MatSelectModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    MatGridListModule,
    FormsModule,
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatTableModule,
    ReactiveFormsModule,
    MatTooltipModule
  ]
})
export class RelatorioProjetosPorMedicaoModule { }
