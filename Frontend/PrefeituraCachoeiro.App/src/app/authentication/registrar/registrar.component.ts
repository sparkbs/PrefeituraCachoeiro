import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginRequest } from 'src/app/request/AuthRequest/loginRequest';
import { AtualizarUsuariosRequest, UsuariosRequest } from 'src/app/request/UsuariosRequest/usuariosRequest';
import { UsuariosResponse } from 'src/app/response/usuariosResponse/usuariosResponse';
import { AuthService } from 'src/app/services/auth.service';
import { CookieProjetaService } from 'src/app/services/AuthService/cookie-projeta.service';
import { ToastService } from 'src/app/services/toast.service';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss']
})
export class RegistrarComponent {
  form: FormGroup;
  listaPerfis: UsuariosResponse[] = [];

  constructor(
    private _router: Router,
    private fb: FormBuilder,
    private _toastService: ToastService,
    public _usuarioControllerService: UsuariosService,
    private readonly _authService: AuthService,
    private readonly cookie: CookieProjetaService
    ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
      this.form = this.fb.group({
        email: ['', [Validators.required]],
        senhaAtual: ['', [Validators.required]],
        senhaNova: ['', [Validators.required]]
      });
  }

  async getUserByLogin() {
      var usuario: UsuariosRequest = {
        pagina: 1,
        itemsPorPagina: 10000,
        nome: this.form.get('email').value
      };

      await this._usuarioControllerService.BuscarTodosUsuarios(usuario)
      .then((res) => {
        this.listaPerfis = res.data;
      })
      .catch((erro) => {
        this._toastService.mensagemError('Login inexistente informado!');
      });
  }

  onReturn() {
    this._router.navigate(['']);
  }

  async salvar() {
    var isUserAuth = await this.verificarSenhaAtual();
    if (isUserAuth) {
      await this.getUserByLogin();

      let usuarioUpdate: AtualizarUsuariosRequest = {
        id: this.listaPerfis[0].idUsuario,
        login: this.listaPerfis[0].login,
        nome: this.listaPerfis[0].nome,
        senha: this.form.get('senhaNova').value,
        prefeituraId: this.listaPerfis[0].prefeituraId
      };

      this._usuarioControllerService.AtualizarUsuarios(usuarioUpdate)
      .then((res) => {
        this._toastService.mensagemSuccess('Usuário atualizado com sucesso!');
        this.cookie.deleteAllCookies();
        this._router.navigate(['']);
      })
      .catch((erro) => {
        this._toastService.mensagemError('Erro ao atualizar usuário!');
      });
    }
  }

  async verificarSenhaAtual(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      let login: LoginRequest = {
        Login: this.form.get('email').value,
        Senha: this.form.get('senhaAtual').value,
      };

      this._authService.Login(login)
        .then((result) => {
          this.cookie.setToken(result.accessToken.accessToken);
          this.cookie.setCookie("_login",this.form.get('email').value.charAt(0).toUpperCase() + this.form.get('email').value.slice(1));
          this.cookie.setCookie("_nome",result.accessToken.nome);
          this.cookie.setCookie("_idUsuario",result.accessToken.idUsuario.toString());
          this.cookie.setCookie("_expiration",result.accessToken.expiration.toString());

          resolve(true);
        })
        .catch((erro) => {
          this._toastService.mensagemError("Senha atual incorreta!");
          resolve(false);
        });
    });
  }
}
