import { Routes } from '@angular/router';
import { AuthSignUpComponent } from 'app/modules/auth/sign-up/sign-up.component';
import { SignUpTeacherComponent } from '../sign-up-teacher/sign-up-teacher.component';
import { SignUpStudentComponent } from '../sign-up-student/sign-up-student.component';

export default [
    {
        path: '',
        component: AuthSignUpComponent,
    },
    {
        path: 'etudiant',
        component: SignUpStudentComponent,
    },
    {
        path: 'prof',
        component: SignUpTeacherComponent,
    },

] as Routes;
