import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent {


  services = [
    {
      icon: 'book',
      title: 'Soutien scolaire',
      description:
        "Cours et accompagnement dans différentes matières pour aider les élèves à renforcer leur niveau académique et améliorer leurs résultats.",
      features: [
        'Cours particuliers adaptés',
        'Aide aux devoirs',
        'Préparation aux examens',
        'Méthodologie de travail',
        'Suivi régulier des progrès',
      ],
      link:"home/soutien_scolaire"
    },
    {
      icon: 'calendar',
      title: "Organisation d'activités scolaires",
      description:
        "Conception et animation d'activités éducatives et ludiques visant à développer la créativité, l'esprit d'équipe et les compétences transversales.",
      features: [
        'Ateliers thématiques',
        'Projets collaboratifs',
        'Activités de développement personnel',
        'Jeux éducatifs',
        'Sorties pédagogiques',
      ],
      link:"home/activites_scolaire"
    },
    {
      icon: 'globe',
      title: 'Cours de langues',
      description:
        'Sessions intensives ou régulières en anglais, français et espagnol pour renforcer les compétences linguistiques.',
      features: [
        'Conversation et expression orale',
        'Grammaire et vocabulaire',
        'Préparation aux certifications',
        "Ateliers d'immersion",
        'Méthodes interactives',
      ],
      link:"home/cours_langues"

    },
  ];
}

