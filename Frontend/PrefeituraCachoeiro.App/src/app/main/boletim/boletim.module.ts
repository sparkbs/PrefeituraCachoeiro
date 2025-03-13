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
import { AprovacaoBoletimComponent } from '../aprovacaoBoletim/aprovacaoBoletim.component';
import { MatButtonModule } from '@angular/material/button';
import { AprovarMedicaoComponent } from '../aprovacaoBoletim/aprovarMedicao/aprovarMedicao.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { VerDocumentosComponent } from '../aprovacaoBoletim/verDocumentos/verDocumentos.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ BoletimComponent, BoletimMedicaoComponent, BoletimProjetoComponent, BoletimDetalhadoComponent, AprovacaoBoletimComponent, AprovarMedicaoComponent, VerDocumentosComponent ],
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
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatTabsModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatTableModule,
    MatListModule,
    SharedModule
  ]
})
export class BoletimModule {}
