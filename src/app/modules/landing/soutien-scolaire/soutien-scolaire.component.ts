import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-soutien-scolaire',
  standalone: true,
  imports: [
     RouterModule,
    NgFor,
    MatIconModule

],
  templateUrl: './soutien-scolaire.component.html',
  styleUrl: './soutien-scolaire.component.scss'
})
export class SoutienScolaireComponent {

  features: string[] = [
    'Cours particuliers adaptés',
    'Aide aux devoirs',
    'Préparation aux examens',
    'Méthodologie de travail',
    'Suivi régulier des progrès'
  ];
}
