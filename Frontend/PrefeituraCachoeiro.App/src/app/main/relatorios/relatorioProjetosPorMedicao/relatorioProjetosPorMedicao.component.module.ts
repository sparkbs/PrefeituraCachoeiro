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

@NgModule({
  declarations: [ RelatorioProjetosPorMedicaoComponent, CadastrarMedicaoComponent ],
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
    MatGridListModule
  ]
})
export class RelatorioProjetosPorMedicaoModule { }
