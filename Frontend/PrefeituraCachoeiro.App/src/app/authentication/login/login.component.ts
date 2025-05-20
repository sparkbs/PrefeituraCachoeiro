import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PerfilLogin } from 'src/app/enums/perfilLogin';
import { LoginRequest } from 'src/app/request/AuthRequest/loginRequest';
import { AuthService } from 'src/app/services/auth.service';
import { CookieProjetaService } from 'src/app/services/AuthService/cookie-projeta.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  login: LoginRequest = new LoginRequest();
  isLoading = false;

  constructor(
    private _router: Router,
    private readonly api: AuthService,
    private readonly usuarioService: UsuariosService,
    private readonly cookie: CookieProjetaService,
    private _toastService: ToastService) {

  }
  async onSubmit(): Promise<void> {
    this.isLoading = true;
    await this.api.Login(this.login)
    .then(async (result) => {
      this.cookie.setToken(result.accessToken.accessToken);
      this.cookie.setCookie("_login",this.login.Login.charAt(0).toUpperCase() + this.login.Login.slice(1));
      this.cookie.setCookie("_nome",result.accessToken.nome);
      this.cookie.setCookie("_idUsuario",result.accessToken.idUsuario.toString());
      this.cookie.setCookie("_expiration",result.accessToken.expiration.toString());

      await this.usuarioService.BuscarUsuario(result.accessToken.idUsuario)
      .then(resultUser => {

        if(resultUser){
          var acesso = resultUser.isSuperAdmin ? PerfilLogin.Admin : PerfilLogin.User;
          this.cookie.setCookie("_acesso",acesso);
        }
      });

      this._router.navigate(['/main/home']);
      this._toastService.mensagemSuccess("Logado com sucesso!");
    })
    .catch((erro) => {
      this._toastService.mensagemError(erro.error.message);
    })
    .finally(() => {
      this.isLoading = false;
    });
  }

  onRegister() {
    this._router.navigate(['/registrar']);
  }
}
