import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { HttpRequestHeaders } from '../../../request/AuthRequest/loginRequest';
import { AuthService } from '../../auth.service';

@Injectable()
export class HttpBaseInterceptor implements HttpInterceptor {
  constructor(
    public auth: AuthService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const httpRequestHeaders: HttpRequestHeaders = {
      Authorization: `Bearer ${this.auth.getToken()}`,
      Login: this.auth.getCookie('_login')
    };

    request = request.clone({ setHeaders: httpRequestHeaders as any });

    return next.handle(request).pipe(
      tap(
        (event: HttpEvent<any>) => {
          if (event instanceof HttpResponse) {
            // do stuff with response if you want
          }
        },
        (err: any) => {
        }
      )
    );
  }
}
