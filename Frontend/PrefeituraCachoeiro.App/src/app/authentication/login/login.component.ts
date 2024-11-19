import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  constructor(private _router: Router,) {

  }
  onSubmit(): void {
    console.log('Formulário de login enviado');

    this._router.navigate(['/main/home']);
  }

  onRegister() {
    this._router.navigate(['/registrar']);
  }
}
