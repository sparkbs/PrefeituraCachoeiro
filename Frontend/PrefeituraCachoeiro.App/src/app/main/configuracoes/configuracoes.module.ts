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
import { EditarCriarGruposPermissoesComponent } from './configuracoes-grupos-permissoes/editar-criar-grupos-permissoes/editar-criar-grupos-permissoes.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatExpansionModule} from '@angular/material/expansion';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TabelaBaseDadosComponent } from './configuracoes-base-dados/tabela-base-dados/tabela-base-dados.component';
import { EditarCriarBaseDadosComponent } from './configuracoes-base-dados/editar-criar-base-dados/editar-criar-base-dados.component';

@NgModule({
  declarations: [ ConfiguracoesComponent, TabelaPerfisComponent, EditarCriarPerfisComponent, TabelaGruposPermissoesComponent, EditarCriarGruposPermissoesComponent, TabelaBaseDadosComponent, EditarCriarBaseDadosComponent ],
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
    MatInputModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatTooltipModule
  ]
})
export class ConfiguracoesModule { }
