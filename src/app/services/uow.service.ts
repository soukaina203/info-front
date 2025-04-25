import { inject, Injectable } from '@angular/core';
import { UserService } from './user.service';
import { AuthService } from 'app/core/auth/auth.service';
import { RoleService } from './role.service';
import { MethodService } from './method.service';
import { NiveauService } from './niveau.service';

@Injectable({
  providedIn: 'root'
})
export class UowService {

  constructor() { }
  readonly users= inject(UserService);
  readonly auth= inject(AuthService);
  readonly role= inject(RoleService);


  readonly method= inject(MethodService);
  readonly niveau= inject(NiveauService);


}
