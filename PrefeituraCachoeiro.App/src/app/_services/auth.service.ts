import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  showMenu = new EventEmitter<boolean>();

  constructor(private router: Router) { }

  login(usuario: boolean) {
    if (usuario) {
      this.showMenu.emit(true);
      this.router.navigate(['/']);
    }
    else {
      this.showMenu.emit(false);
    }
  }
}
