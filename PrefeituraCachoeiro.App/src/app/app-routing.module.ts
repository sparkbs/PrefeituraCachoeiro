import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { RegistrarComponent } from './authentication/registrar/registrar.component';
import { HomeComponent } from './main/home/home.component';
import { MainComponent } from './main/main.component';
import { ProjetosComponent } from './main/projetos/projetos.component';
import { ContratosComponent } from './main/contratos/contratos.component';
import { ConfiguracoesComponent } from './main/configuracoes/configuracoes.component';
import { PerfilComponent } from './main/perfil/perfil.component';
import { Editar_criar_contratosComponent } from './main/contratos/editar_criar_contratos/editar_criar_contratos.component';
import { RelatorioProjetosPorMedicaoComponent } from './main/relatorios/relatorioProjetosPorMedicao/relatorioProjetosPorMedicao.component';
import { PrefeituraComponent } from './main/prefeitura/prefeitura/prefeitura.component';

const routes: Routes = [

  { path: '', component: LoginComponent },
  { path: 'registrar', component: RegistrarComponent },
  { path: 'main',
    component: MainComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'projetos', component: ProjetosComponent },
      { path: 'contratos', component: ContratosComponent },
      { path: 'configuracoes', component: ConfiguracoesComponent },
      { path: 'perfil', component: PerfilComponent},
      { path: 'editarCriarContratos', component: Editar_criar_contratosComponent},
      { path: 'relatorioProjetosPorMedicao', component: RelatorioProjetosPorMedicaoComponent},
      { path: 'prefeitura', component: PrefeituraComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
