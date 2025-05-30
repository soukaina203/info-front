import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { inscriptionProfInterface } from 'app/interfaces/inscriptionProf';
import { User } from 'app/models/User';
import { environment } from 'environment/environment';
import { Observable, of } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor() { }
    protected urlApi: string = environment.apiUrl;
    protected http = inject(HttpClient);
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);

    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
    }

    register(user: User): Observable<any> { // for students
        return this.http.post(`${this.urlApi}/Account/RegisterStudent`, user);
    }

    registerProf(user: inscriptionProfInterface): Observable<any> { // for teachers
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
        return this.http.get(`${this.urlApi}/Account/refresh`);
    }

    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }



    activeAccount(userId: string|number): Observable<any> {
        return this.http.get(`${this.urlApi}/Account/activeAccount/${userId}`);
    }


    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
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
