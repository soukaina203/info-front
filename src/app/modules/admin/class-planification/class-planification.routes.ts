import { Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ClassPlanificationComponent } from './class-planification.component';

export default [
    {
        path: '',
        component: ClassPlanificationComponent,
    },
    {
        path: 'edit/:id',
        component: EditComponent,
    },
    {
        path: 'create',
        component: CreateComponent,
    },
] as Routes;
