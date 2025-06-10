import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { inscriptionProfInterface } from 'app/interfaces/inscriptionProf';
import { User } from 'app/models/User';
import { environment } from 'environment/environment';
import { Observable, of } from 'rxjs';
import { UserService } from './user.service';
import { IResetPassword } from 'app/interfaces/IResetPassword';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor() { }
    protected urlApi: string = environment.apiUrl;
    protected http = inject(HttpClient);
    private _authenticated: boolean = false;
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



    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }



}
