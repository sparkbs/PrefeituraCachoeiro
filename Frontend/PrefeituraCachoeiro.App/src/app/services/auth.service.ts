import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Environments } from '../environments/Environments';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../request/AuthRequest/loginRequest';
import { AuthResponse } from '../response/AuthResponse/authResponse';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  showMenu = new EventEmitter<boolean>();

  constructor(private router: Router, private readonly http: HttpClient, private readonly cookie: CookieService) { }

  public getToken(){
    return this.cookie.get('_token');
  }

  public getCookie(nome: string){
    const cookieValue = this.cookie.get(nome);
    return cookieValue;
  }

  login(usuario: boolean) {
    if (usuario) {
      this.showMenu.emit(true);
      this.router.navigate(['/']);
    }
    else {
      this.showMenu.emit(false);
    }
  }

  public async Login(request: LoginRequest): Promise<AuthResponse> {
    return await firstValueFrom(
      this.http.post<AuthResponse>(
        `${Environments.APIUrl}/login/verificarLogin`,
        request
      )
    );
  }
}
