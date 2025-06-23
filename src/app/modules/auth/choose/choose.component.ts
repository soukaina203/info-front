import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-choose',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './choose.component.html',
  styleUrl: './choose.component.scss' // Petite erreur : devrait être "styleUrls"
})
export class ChooseComponent {
  // Tableau des profils affichés dans le composant, avec rôle, description, icône et lien d'inscription
  profiles = [
    {
      role: 'Étudiant',
      description: 'Inscrivez-vous pour accéder à nos cours et services',
      icon: 'book',
      link: '/sign-up/etudiant'
    },
    {
      role: 'Professeur',
      description: 'Rejoignez notre équipe d\'enseignants',
      icon: 'user',
      link: '/sign-up/prof'
    }
  ];
}
