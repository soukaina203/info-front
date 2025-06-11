import { Routes } from '@angular/router';
import { LandingHomeComponent } from 'app/modules/landing/home/home.component';
import { SoutienScolaireComponent } from '../soutien-scolaire/soutien-scolaire.component';
import { CoursLangueComponent } from '../cours-langue/cours-langue.component';
import { ActivitesScolaireComponent } from '../activites-scolaire/activites-scolaire.component';

export default [
    {
        path: '',
        component: LandingHomeComponent,
    },
    {
        path: 'soutien_scolaire',
        component: SoutienScolaireComponent,
    },
    {
        path: 'cours_langues',
        component: CoursLangueComponent,
    },
    {
        path: 'activites_scolaire',
        component: ActivitesScolaireComponent,
    },

] as Routes;
