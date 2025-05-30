import { Injectable } from '@angular/core';
import { Role } from 'app/models/Role';
import { SuperService } from './super.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService extends SuperService<Role> {

    constructor() {
        super('role');

    }
}
