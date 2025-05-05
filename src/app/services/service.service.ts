import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
    protected urlApi: string = environment.apiUrl;// InjectService.injector.get('API_URL');
    protected http = inject(HttpClient);
  constructor() { }
  getServicesData(): Observable<any> {
    return this.http.get(`${this.urlApi}/Account/GetServicesData`);
}

}
