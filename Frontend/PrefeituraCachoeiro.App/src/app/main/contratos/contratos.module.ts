import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContratosComponent } from './contratos.component';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { Editar_criar_contratosComponent } from './criar_contratos/editar_criar_contratos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AditivosContratosComponent } from './aditivos-contratos/aditivos-contratos.component';
import { MatSelectModule } from '@angular/material/select';
import { Editar_contratosComponent } from './editar_contratos/editar_contratos/editar_contratos.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatRadioModule } from '@angular/material/radio'; // Importar MatRadioModule
import { VerAnexosAditivosComponent } from './ver-anexos-aditivos/ver-anexos-aditivos.component';
import { MatOptionModule } from '@angular/material/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [ ContratosComponent, Editar_criar_contratosComponent, AditivosContratosComponent, Editar_contratosComponent, VerAnexosAditivosComponent ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatCardModule,
    MatFormFieldModule, 
    MatInputModule,
    MatTableModule,
    MatIconModule,
    BrowserAnimationsModule,
    BrowserModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule ,
    SharedModule,
    MatSelectModule,
    MatRadioModule,
    MatAutocompleteModule,
    MatOptionModule,
    MatCheckboxModule
  ]
})
export class ContratosModule { }
