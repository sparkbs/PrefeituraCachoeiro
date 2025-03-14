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
import { Editar_criar_contratosComponent } from './main/contratos/criar_contratos/editar_criar_contratos.component';
import { RelatorioProjetosPorMedicaoComponent } from './main/relatorios/relatorioProjetosPorMedicao/relatorioProjetosPorMedicao.component';
import { PrefeituraComponent } from './main/prefeitura/prefeitura/prefeitura.component';
import { BoletimComponent } from './main/boletim/boletim.component';
import { BoletimMedicaoComponent } from './main/boletim/boletim-medicao/boletim-medicao.component';
import { BoletimProjetoComponent } from './main/boletim/boletim-projeto/boletim-projeto.component';
import { BoletimDetalhadoComponent } from './main/boletim/boletim-detalhado/boletim-detalhado.component';
import { AprovacaoBoletimComponent } from './main/aprovacaoBoletim/aprovacaoBoletim.component';
import { PowerBIComponent } from './main/relatorios/powerBI/powerBI.component';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [

  { path: '', component: LoginComponent },
  { path: 'registrar', component: RegistrarComponent },
  {
    path: 'main',
    component: MainComponent,
    children: [
      { path: 'home', component: HomeComponent },
      { path: 'projetos', component: ProjetosComponent, canActivate: [AuthGuardService] },
      { path: 'contratos', component: ContratosComponent, canActivate: [AuthGuardService] },
      { path: 'configuracoes', component: ConfiguracoesComponent, canActivate: [AuthGuardService] },
      { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuardService] },
      { path: 'editarCriarContratos', component: Editar_criar_contratosComponent, canActivate: [AuthGuardService] },
      { path: 'relatorioProjetosPorMedicao', component: RelatorioProjetosPorMedicaoComponent, canActivate: [AuthGuardService] },
      { path: 'prefeitura', component: PrefeituraComponent, canActivate: [AuthGuardService] },
      { path: 'boletim', component: BoletimComponent, canActivate: [AuthGuardService]},
      { path: 'boletimMedicao/:clienteId/:contratoId/:medicaoId', component: BoletimMedicaoComponent, canActivate: [AuthGuardService] },
      { path: 'boletimPorProjeto/:projetoId/:medicaoId', component: BoletimProjetoComponent, canActivate: [AuthGuardService] },
      { path: 'boletimDetalhado/:clienteId/:contratoId/:medicaoId', component: BoletimDetalhadoComponent, canActivate: [AuthGuardService] },
      { path: 'aprovacaoBoletim', component: AprovacaoBoletimComponent, canActivate: [AuthGuardService] },
      { path: 'powerBi', component: PowerBIComponent, canActivate: [AuthGuardService] }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
