import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { ClassPlanificationComponent } from './class-planification/class-planification.component';

export default [
    {
        path: '',
        component: DashboardComponent,
    },
    {
        path: 'profile',
        component: ProfileComponent,
    },
    {
        path: 'planification',
        component: ClassPlanificationComponent,
    },
] as Routes;
