import { Injectable } from '@angular/core';
import { SuperService } from './super.service';
import { User } from 'app/models/User';
import { BehaviorSubject } from 'rxjs';
import { inscriptionProfInterface } from 'app/interfaces/inscriptionProf';

@Injectable({
  providedIn: 'root'
})
export class UserService extends SuperService<inscriptionProfInterface>{
 currentUser$= new BehaviorSubject<User | null>(null);
    constructor() {
        super('users');

    }
}
