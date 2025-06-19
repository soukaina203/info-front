import { inject, Injectable } from '@angular/core';
import { SuperService } from './super.service';
import { User } from 'app/models/User';
import { BehaviorSubject, Observable } from 'rxjs';
import { inscriptionProfInterface } from 'app/interfaces/inscriptionProf';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService extends SuperService<inscriptionProfInterface>{
    currentUser$= new BehaviorSubject<User | null>(null);
    protected urlApi: string = environment.apiUrl;
    protected http = inject(HttpClient);


    constructor() {
        super('users');

    }
    GetUserById(id:number): Observable<User>{
        return this.http.get<User>(`${this.urlApi}/Users/GetUserById/${id}`);
    }

     putUser( id: number | string, dto:any ): Observable<any>{
        return this.http.put<User>(`${this.urlApi}/Users/PutUser/${id}`,dto);
    }


}
