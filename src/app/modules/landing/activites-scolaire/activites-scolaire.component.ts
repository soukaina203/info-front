import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-activites-scolaire',
  standalone: true,
  imports: [RouterModule, MatIconModule, NgFor],
  templateUrl: './activites-scolaire.component.html',
  styleUrl: './activites-scolaire.component.scss'
})
export class ActivitesScolaireComponent {
 activities = [
    "Ateliers thématiques",
    "Projets collaboratifs",
    "Activités de développement personnel",
    "Jeux éducatifs",
    "Sorties pédagogiques"
  ];
}
