import { Injectable } from '@angular/core';
import { SuperService } from './super.service';
import { User } from 'app/models/User';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService extends SuperService<User>{
 currentUser$= new BehaviorSubject<User | null>(null);
    constructor() {
        super('users');

    }
}
