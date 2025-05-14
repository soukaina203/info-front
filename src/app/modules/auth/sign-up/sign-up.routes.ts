import { Routes } from '@angular/router';
import { SignUpTeacherComponent } from '../sign-up-teacher/sign-up-teacher.component';
import { SignUpStudentComponent } from '../sign-up-student/sign-up-student.component';

export default [

    {
        path: 'etudiant',
        component: SignUpStudentComponent,
    },
    {
        path: 'prof',
        component: SignUpTeacherComponent,
    },

] as Routes;
