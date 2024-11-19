import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfiguracoesComponent } from './configuracoes.component';
import {MatCardModule} from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import { TabelaPerfisComponent } from './configuracoes-perfil/tabela-perfis/tabela-perfis.component';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { EditarCriarPerfisComponent } from './configuracoes-perfil/editar-criar-perfis/editar-criar-perfis.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TabelaGruposPermissoesComponent } from './configuracoes-grupos-permissoes/tabela-grupos-permissoes/tabela-grupos-permissoes.component';

@NgModule({
  declarations: [ ConfiguracoesComponent, TabelaPerfisComponent, EditarCriarPerfisComponent, TabelaGruposPermissoesComponent ],
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class ConfiguracoesModule { }
