import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CookieProjetaService } from 'src/app/services/AuthService/cookie-projeta.service';
import { UsuariosService } from 'src/app/services/usuarios.service';
import { AESEncryptDecriptService } from 'src/app/shared/aesEncryptDecript.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private _router: Router, 
    private auth: AuthService, 
    private readonly cookie: CookieProjetaService,
    private readonly usuarioService: UsuariosService,
    private readonly aesEncryptDecript: AESEncryptDecriptService){

  }
  async ngOnInit(): Promise<void> {
    var idUsuario = this.auth.getCookie("_idUsuario");
    var prefeituraId = null;

    if(idUsuario){
      idUsuario = this.aesEncryptDecript.decrypt(idUsuario);

      await this.usuarioService.BuscarUsuario(Number(idUsuario))
      .then(resultUser => {prefeituraId = resultUser.prefeituraId});
    }

    this.cookie.setCookie("_idPrefeitura",prefeituraId?.toString());
  }
}
