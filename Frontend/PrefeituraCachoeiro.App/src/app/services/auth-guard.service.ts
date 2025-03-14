import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {
  constructor(private router: Router, private cookieService: CookieService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const idPrefeitura = this.cookieService.get('_idPrefeitura');

    if (idPrefeitura && state.url !== '/main/aprovacaoBoletim') {
      this.router.navigate(['/main/aprovacaoBoletim']);
      return false;
    }

    if (!idPrefeitura && state.url === '/main/aprovacaoBoletim') {
      this.router.navigate(['/main/home']);
      return false;
    }

    return true;
  }
}
