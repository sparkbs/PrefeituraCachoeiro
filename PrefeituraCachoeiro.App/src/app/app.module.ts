import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginModule } from './authentication/login/login.module';
import { RegistrarModule } from './authentication/registrar/registrar.module';
import { HomeModule } from './main/home/home.module';
import { ProjetosModule } from './main/projetos/projetos.module';
import { AuthService } from './_services/auth.service';
import { MainComponent } from './main/main.component';
import { SidebarComponent } from './layout/components/sidebar/sidebar.component';
import { ContratosModule } from './main/contratos/contratos.module';
import { NavbarComponent } from './layout/components/navbar/navbar.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { ConfiguracoesModule } from './main/configuracoes/configuracoes.module';
import {MatCardModule} from '@angular/material/card';
import { PerfilComponent } from './main/perfil/perfil.component';
import { PerfilModule } from './main/perfil/perfil.module';

@NgModule({
  declarations: [ AppComponent, MainComponent, SidebarComponent, NavbarComponent ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,

    // Autenticação
    LoginModule,
    RegistrarModule,
    HomeModule,
    ProjetosModule,
    MatIconModule,
    ContratosModule,
    MatTooltipModule,
    ConfiguracoesModule,
    MatCardModule,
    PerfilModule
  ],
  providers: [ AuthService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
