import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { inscriptionProfInterface } from 'app/interfaces/inscriptionProf';
import { User } from 'app/models/User';
import { environment } from 'environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
protected urlApi: string = environment.apiUrl;
protected http = inject(HttpClient);

register(user:User): Observable<any> { // for students
    return this.http.post(`${this.urlApi}/Account/RegisterStudent`,user);
}

registerProf(user:inscriptionProfInterface): Observable<any> { // for teachers
    return this.http.post(`${this.urlApi}/Account/RegisterProf`,user);
}

getServicesData(): Observable<any> {
    return this.http.get(`${this.urlApi}/Account/GetServicesData`);
}

SendVerificationMail (mailData:object): Observable<any> {
    return this.http.post(`${this.urlApi}/Account/SendVerificationMail`,mailData);
}
login (user:object): Observable<any> {
    return this.http.post(`${this.urlApi}/Account/login`,user);
}
}
