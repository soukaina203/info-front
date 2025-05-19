import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';

export default [
    {
        path     : '',
        component: DashboardComponent,
    },
     {
        path     : 'profile',
        component: ProfileComponent,
    },
] as Routes;
