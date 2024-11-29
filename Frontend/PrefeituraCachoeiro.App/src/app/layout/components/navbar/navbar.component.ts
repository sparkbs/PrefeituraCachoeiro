import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { CookieProjetaService } from 'src/app/services/AuthService/cookie-projeta.service';
import { AESEncryptDecriptService } from 'src/app/shared/aesEncryptDecript.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  showProfileCard = false;
  nomeUsuario = "";

  constructor(private _router: Router, 
    private readonly cookie: CookieProjetaService, 
    public auth: AuthService,
    private readonly aesEncryptDecript: AESEncryptDecriptService) {
  }

  ngOnInit(): void {
    const cookieValue = this.auth.getCookie('_login');
    this.nomeUsuario = this.aesEncryptDecript.decrypt(cookieValue);
  }

  toggleProfileCard() {
    this.showProfileCard = !this.showProfileCard;
  }

  logout(){
    this.cookie.deleteAllCookies();
    this._router.navigate(['']);
  }
}
