import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { ClassPlanificationComponent } from './class-planification/class-planification.component';

export default [
    {
        path: 'dashboard',
        component: DashboardComponent,
    },
    {
        path: 'profile',
        component: ProfileComponent,
    },
    {
        path: 'planification',
        children: [
            { path: '', loadChildren: () => import('app/modules/admin/class-planification/class-planification.routes') },
        ]
    },
    {
        path: 'classes',
        children: [
            { path: '', loadChildren: () => import('app/modules/admin/cours-en-lignes/cours.routes') },
        ]
    },
        {
        path: 'users',
        children: [
            { path: '', loadChildren: () => import('app/modules/admin/users/users.routes') },
        ]
    },
] as Routes;
