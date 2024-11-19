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
import { Editar_criar_contratosComponent } from './editar_criar_contratos/editar_criar_contratos.component';
import { FormsModule } from '@angular/forms';
import { AditivosContratosComponent } from './aditivos-contratos/aditivos-contratos.component';

@NgModule({
  declarations: [ ContratosComponent, Editar_criar_contratosComponent, AditivosContratosComponent ],
  imports: [
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
    FormsModule 
  ]
})
export class ContratosModule { }
