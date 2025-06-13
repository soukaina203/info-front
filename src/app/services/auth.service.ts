import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { inscriptionProfInterface } from 'app/interfaces/inscriptionProf';
import { User } from 'app/models/User';
import { environment } from 'environment/environment';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { UserService } from './user.service';
import { IResetPassword } from 'app/interfaces/IResetPassword';
import { AuthUtils } from 'app/core/auth/auth.utils';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor() { }
    protected urlApi: string = environment.apiUrl;
    protected http = inject(HttpClient);
    public _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _userService = inject(UserService)

    setAccessToken(token: string): void {
        localStorage.setItem('accessToken', token);
    }
    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    register(user: User): Observable<any> { // for students
        return this.http.post(`${this.urlApi}/Account/RegisterStudent`, user);
    }
    verifyRegistrationToken(id: number, token: string) {
        return this.http.post(`${this.urlApi}/Account/VerifyRegistrationToken`, { id, token });
    }

    registerProf(user: inscriptionProfInterface): Observable<any> {
        return this.http.post(`${this.urlApi}/Account/RegisterProf`, user);
    }

    getServicesData(): Observable<any> {
        return this.http.get(`${this.urlApi}/Account/GetServicesData`);
    }

    SendVerificationMail(mailData: object): Observable<any> {
        return this.http.post(`${this.urlApi}/Account/SendVerificationMail`, mailData);
    }

    login(user: object): Observable<any> {
        return this.http.post(`${this.urlApi}/Account/login`, user);
    }

    refreshToken(): Observable<any> {
        return this.http.get(`${this.urlApi}/Account/refresh`, {
            withCredentials: true
        });
    }

    forgotPassword(object: IResetPassword): Observable<any> {
        return this.http.post(`${this.urlApi}/Account/forgetPassword`, {
            id: object.id,
            email: object.email,
            name: object.name

        });
    }

    resetPassword(token: string, password: string): Observable<any> {

        return this.http.post(`${this.urlApi}/Account/resetPassword`, { token, password });
    }

    activeAccount(userId: string | number): Observable<any> {
        return this.http.get(`${this.urlApi}/Account/activeAccount/${userId}`);
    }


    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this._httpClient.post('api/auth/sign-in-with-token', {
            accessToken: this.accessToken,
        }).pipe(
            catchError(() =>

                // Return false
                of(false),
            ),
            switchMap((response: any) => {
                // Replace the access token with the new one if it's available on
                // the response object.
                //
                // This is an added optional step for better security. Once you sign
                // in using the token, you should generate a new one on the server
                // side and attach it to the response object. Then the following
                // piece of code can replace the token with the refreshed one.
                if (response.accessToken) {
                    this.setAccessToken(response.accessToken);
                }

                // Set the authenticated flag to true
                this._authenticated = true;


                // Return true
                return of(true);
            }),
        );
    }

    check(): Observable<boolean> {
        // Check if the user is logged in
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // Check the access token expire date
        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        // If the access token exists, and it didn't expire, sign in using it
        return of(true)
    }



    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }



}
