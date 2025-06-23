import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from 'environment/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuperService<T> {
    protected http = inject(HttpClient);
    protected urlApi: string = environment.apiUrl;
    protected url: string = environment.url;

    constructor(public controller: string) { }

    getAll = () => this.http.get<T[]>(`${this.urlApi}/${this.controller}/getAll`);

    put = (id: number | string, o: T) => this.http.put(`${this.urlApi}/${this.controller}/put/${id}`, o);

    getOne = (id: number) => this.http.get(`${this.urlApi}/${this.controller}/getById/${id}`);

    post = (o: T) => this.http.post<T>(`${this.urlApi}/${this.controller}/post`, o);

    patch = (id: number, model:T) =>this.http.patch<T>(`${this.urlApi}/${this.controller}/patch/${id}`, model);

    delete = (id: number) => this.http.delete<T>(`${this.urlApi}/${this.controller}/delete/${id}`);



}
