import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/request/AuthRequest/loginRequest';
import { AuthService } from 'src/app/services/auth.service';
import { CookieProjetaService } from 'src/app/services/AuthService/cookie-projeta.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  login: LoginRequest = new LoginRequest();

  constructor(private _router: Router, private readonly api: AuthService, private readonly cookie: CookieProjetaService) {

  }
  async onSubmit(): Promise<void> {
    console.log('Formulário de login enviado');

    await this.api.Login(this.login)
    .then((result) => {  
      this.cookie.setToken(result.accessToken.accessToken);
      this.cookie.setCookie("_login",result.accessToken.nome);
      this.cookie.setCookie("_idUsuario",result.accessToken.idUsuario.toString());
      this.cookie.setCookie("_expiration",result.accessToken.expiration.toString());

      this._router.navigate(['/main/home']);
    });
  }

  onRegister() {
    this._router.navigate(['/registrar']);
  }
}
