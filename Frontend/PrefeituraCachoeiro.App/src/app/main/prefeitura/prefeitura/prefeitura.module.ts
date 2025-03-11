import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSelectModule} from '@angular/material/select';
import { PrefeituraComponent } from './prefeitura.component';
import { MatSortModule } from '@angular/material/sort';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Editar_criar_prefeituraComponent } from '../editar_criar_prefeitura/editar_criar_prefeitura.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ PrefeituraComponent, Editar_criar_prefeituraComponent ],
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
    FormsModule,
    SharedModule
  ]
})
export class PrefeituraModule { }
