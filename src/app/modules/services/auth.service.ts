import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }
  // gonna contain just two methods at the begining Register and login
protected urlApi: string = environment.apiUrl;// InjectService.injector.get('API_URL');
protected http = inject(HttpClient);

register(user:User): Observable<any> {
    return this.http.post(`${this.urlApi}/Account/Register`,user);
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
