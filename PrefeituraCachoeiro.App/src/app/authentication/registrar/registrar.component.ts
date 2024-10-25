import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.scss']
})
export class RegistrarComponent {

  constructor(private _router: Router,) {

  }

  onSubmit() {
    this._router.navigate(['/main/home']);
  }

  onReturn() {
    this._router.navigate(['']);
  }
}
