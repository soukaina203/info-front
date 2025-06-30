import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpRequest
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { AuthService } from 'app/services/auth.service';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

export const authInterceptor = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);

    let newReq = req;

    // Check token validity
    if (!authService.accessToken || AuthUtils.isTokenExpired(authService.accessToken)) {
        // Continue the request without Authorization header
        return next(req);
    }

    // Attach Authorization header
    newReq = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + authService.accessToken),
    });

    return next(newReq).pipe(
        catchError((error) => {
            if (
                 error instanceof HttpErrorResponse &&
                error.status === 401
            ) {
                if (req.url.includes('/Account/refresh')) {
                    authService.signOut();
                     location.href = '/sign-in';
                    return throwError(() => error);
                }

                return authService.refreshToken().pipe(
                    switchMap((response: any) => {
                        const newToken = response?.token;

                        if (newToken) {
                            authService.setAccessToken(newToken);
                            const retryReq = req.clone({
                                headers: req.headers.set('Authorization', 'Bearer ' + newToken),
                            });
                            return next(retryReq);
                        } else {
                            authService.signOut();
                            return throwError(() => new Error('No new token in refresh response'));
                        }
                    }),
                    catchError((refreshError) => {
                        authService.signOut();
                        return throwError(() => refreshError);
                    })
                );
            }

            return throwError(() => error);
        })
    );
};
