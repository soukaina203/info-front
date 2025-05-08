import { inject, Injectable } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { MethodService } from 'app/services/method.service';
import { NiveauService } from 'app/services/niveau.service';
import { RoleService } from 'app/services/role.service';
import { UserService } from 'app/services/user.service';
import { ServiceService } from './service.service';
import { SuperService } from './super.service';
import { UploadService } from './upload.service';


@Injectable({
    providedIn: 'root'
})
export class UowService {

    constructor() { }
    readonly users = inject(UserService);
    readonly auth = inject(AuthService);
    readonly role = inject(RoleService);


    readonly method = inject(MethodService);
    readonly niveau = inject(NiveauService);
    readonly service = inject(ServiceService);


    readonly upload = inject(UploadService);


}
