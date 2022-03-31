import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const TYPES = [
  'ilt-events',
  'ilt-courses',
  'self-paced-courses',
  'internal-repository',
  'marketplace-repo',
  'certificates',
];

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptor implements HttpInterceptor {
  public constructor(private readonly store: Store, private readonly router: Router) {}

  public intercept<T>(req: HttpRequest<T>, next: HttpHandler): Observable<HttpEvent<T>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        switch (error.status) {
          case 401: {
            this.store.dispatch(['401']);
            break;
          }
          case 403: {
            this.router.navigate(['403']);
            break;
          }
          case 404: {
            const currentUrl = this.router.routerState.snapshot.url;
            const currentType = TYPES.find((type) => currentUrl.includes(type));
            if (currentType) {
              this.router.navigate(['admin', currentType, '404']);
            } else {
              this.router.navigate(['404']);
            }
            break;
          }
        }

        const newError = {
          name: error.name,
          ok: error.ok,
          status: error.status,
          statusText: error.statusText,
          message: error.error.message,
        };

        return throwError(newError);
      }),
    );
  }
}
