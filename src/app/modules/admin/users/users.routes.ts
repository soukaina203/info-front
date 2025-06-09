import { Routes } from '@angular/router';
import { UsersComponent } from './users.component';
import { EditUserComponent } from './edit-user/edit-user.component';

export default [
    {
        path     : '',
        component: UsersComponent,
    },
    {
        path     : ':id',
        component: EditUserComponent,
    },

] as Routes;
