import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { AuthService } from 'app/services/auth.service';
import { catchError, from, Observable, switchMap, throwError } from 'rxjs';

/**
 * Auth Interceptor
 */
export const authInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);

  let newReq = req;

  // Add Authorization header if token exists and not expired
  if (authService.accessToken && !AuthUtils.isTokenExpired(authService.accessToken)) {
    newReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + authService.accessToken),
    });
  }

  return next(newReq).pipe(
    catchError((error) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Try to refresh token
        return authService.refreshToken().pipe(
          switchMap((newToken: string) => {
            // Retry the original request with new token
            const retryReq = req.clone({
              headers: req.headers.set('Authorization', 'Bearer ' + newToken),
            });
            return next(retryReq);
          }),
          catchError(refreshError => {
            // Refresh failed: logout and reload
            authService.signOut();
            location.reload();
            return throwError(() => refreshError);
          })
        );
      }

      return throwError(() => error);
    })
  );
};
