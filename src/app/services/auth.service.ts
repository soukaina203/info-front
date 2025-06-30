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
        return this.http.get(`${this.urlApi}/Account/refresh/${localStorage.getItem("userId")}`, {
            withCredentials: true
        });
    }

    forgotPassword(email:string): Observable<any> {
        console.log("email")
        console.log(email)
        return this.http.get(`${this.urlApi}/Account/forgetPassword/${email}`);
    }

    resetPassword(token: string, password: string): Observable<any> {

        return this.http.post(`${this.urlApi}/Account/resetPassword`, { token, password });
    }

    activeAccount(userId: string | number): Observable<any> {
        return this.http.get(`${this.urlApi}/Account/activeAccount/${userId}`);
    }


    signInUsingToken(): Observable<any> {
        return this._httpClient.post('api/auth/sign-in-with-token', {
            accessToken: this.accessToken,
        }).pipe(
            catchError(() =>

                of(false),
            ),
            switchMap((response: any) => {

                if (response.accessToken) {
                    this.setAccessToken(response.accessToken);
                }

                this._authenticated = true;


                return of(true);
            }),
        );
    }

    check(): Observable<boolean> {
        if (this._authenticated) {
            return of(true);
        }

        if (!this.accessToken) {
            return of(false);
        }

        if (AuthUtils.isTokenExpired(this.accessToken)) {
            return of(false);
        }

        return of(true)
    }



    signOut(): Observable<any> {
        localStorage.removeItem('accessToken');

        this._authenticated = false;

        return of(true);
    }



}
