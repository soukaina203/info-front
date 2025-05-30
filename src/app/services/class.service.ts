import { Injectable } from '@angular/core';
import { SuperService } from './super.service';
import { Class } from 'app/models/Class';
import { Observable } from 'rxjs';
import { IResponse } from 'app/interfaces/IResponse';

@Injectable({
    providedIn: 'root'
})
export class ClassService extends SuperService<Class> {

    constructor() {
        super('class');

    }
    getClassesByProfId(userId: number): Observable<IResponse> {
        return this.http.get<IResponse>(`${this.urlApi}/Class/GetClassesByProfId/${userId}`);

    }
}
