import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { CoursEnLignesComponent } from './cours-en-lignes.component';
import { ShowComponent } from './show/show.component';


export default [
    {
        path: '',
        component: CoursEnLignesComponent
    },
    {
        path: ':id',
        component: ShowComponent
    },
] as Routes;
