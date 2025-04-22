import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-testimonial',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonial.component.html',
  styleUrl: './testimonial.component.scss'
})
export class TestimonialComponent {
    testimonials = [
        {
          quote: "Grâce au soutien scolaire d'Info Académie, mon fils a considérablement amélioré ses notes en mathématiques et a retrouvé confiance en lui.",
          name: "Karim B.",
          role: "Parent d'un élève de 3ème"
        },
        {
          quote: "Les activités proposées par Info Académie ont permis à mon enfant de développer son esprit d'équipe tout en s'amusant. Une approche pédagogique remarquable.",
          name: "Thomas M.",
          role: "Parent d'un élève de CM2"
        },
        {
          quote: "Les cours d'anglais intensifs ont été déterminants pour ma réussite au TOEFL. Méthodologie efficace et professeurs attentifs.",
          name: "Mehdi R.",
          role: "Étudiant universitaire"
        }
      ];

      stats = [
        { value: '950+', label: 'Élèves accompagnés' },
        { value: '92%', label: 'Taux de réussite' },
        { value: '15+', label: 'Programmes éducatifs' },
        { value: '8', label: "Années d'expérience" }
      ];
}
