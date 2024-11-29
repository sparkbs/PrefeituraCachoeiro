import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { AESEncryptDecriptService } from 'src/app/shared/aesEncryptDecript.service';

@Injectable({
  providedIn: 'root'
})
export class CookieProjetaService {
  constructor(
    private readonly cookie: CookieService,
    private readonly aesEncryptDecript: AESEncryptDecriptService
  ) {}

  public setToken(valor: string) {
    this.cookie.set('_token', valor, { path: '/' });
  }

  public deleteAllCookies() {
    this.cookie.deleteAll('/');
    this.cookie.deleteAll();
  }

  public setCookie(nome: string, valor: string) {
    const encryptValue = this.aesEncryptDecript.encrypt(valor);
    this.cookie.set(nome, encryptValue, { path: '/' });
  }
}
