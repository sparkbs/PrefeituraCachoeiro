import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule} from '@angular/material/expansion';
import { RelatorioProjetosPorMedicaoComponent } from './relatorioProjetosPorMedicao.component';
import { MatCardModule } from '@angular/material/card';
import {MatTabsModule} from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';
import {MatSelectModule} from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ RelatorioProjetosPorMedicaoComponent ],
  imports: [
    MatButtonModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatCardModule,
    MatTabsModule,
    MatListModule,    
    MatSelectModule,
    MatIconModule
  ]
})
export class RelatorioProjetosPorMedicaoModule { }
