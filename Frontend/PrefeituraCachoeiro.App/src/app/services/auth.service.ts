import { EventEmitter, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { GenericResultResponse } from '../response/genericResultResponse';
import { firstValueFrom } from 'rxjs';
import { Environments } from '../environments/Environments';
import { HttpClient } from '@angular/common/http';
import { LoginRequest } from '../request/AuthRequest/loginRequest';
import { AuthResponse } from '../response/AuthResponse/authResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  showMenu = new EventEmitter<boolean>();

  constructor(private router: Router, private readonly http: HttpClient) { }

  login(usuario: boolean) {
    if (usuario) {
      this.showMenu.emit(true);
      this.router.navigate(['/']);
    }
    else {
      this.showMenu.emit(false);
    }
  }

  public async Login(request: LoginRequest): Promise<GenericResultResponse<AuthResponse>> {
    return await firstValueFrom(
      this.http.post<GenericResultResponse<AuthResponse>>(
        `${Environments.APIUrl}/login/verificarLogin`,
        request
      )
    );
  }
}
