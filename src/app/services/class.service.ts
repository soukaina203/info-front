import { Injectable } from '@angular/core';
import { SuperService } from './super.service';
import { Class } from 'app/models/Class';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ClassService extends SuperService<Class> {

    constructor() {
        super('classes');

    }
    getClassesByProfId(id: int): Observable<Class[]> {
        return this.http.get(`${this.urlApi}/Classes/RegisterStudent`);

    }
}
