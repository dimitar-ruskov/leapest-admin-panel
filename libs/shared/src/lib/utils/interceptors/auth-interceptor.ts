import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { OktaAuthStateService } from '@okta/okta-angular';
import { from, Observable } from 'rxjs';
import {EnvironmentService} from "../../services/common/environment.service";

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private readonly environment: EnvironmentService,
    private readonly oktaAuthStateService: OktaAuthStateService,
  ) {}

  async handle(request: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    const skipInterceptor = request.headers.has('skip-auth-interceptor');

    if (skipInterceptor) {
      request = request.clone({
        headers: request.headers.delete('skip-auth-interceptor'),
      });
    }

    const accessToken = (await this.oktaAuthStateService['oktaAuth'].tokenManager.get('accessToken'))?.accessToken;
    let newRequest = request;
    if (
      accessToken &&
      (request.url.startsWith(`${this.environment.amberBaseUrl}/api`) ||
        request.url.startsWith(`${this.environment.amberBaseUrl}/domain/api`)) &&
      !skipInterceptor
    ) {
      newRequest = request.clone({
        headers: request.headers.set('Authorization', `Bearer ${accessToken}`),
      });
    }
    return next.handle(newRequest).toPromise();
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handle(request, next));
  }
}
