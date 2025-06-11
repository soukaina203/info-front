import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { NgFor } from '@angular/common';
@Component({
  selector: 'app-cours-langue',
  standalone: true,
  imports: [RouterModule, MatIconModule, NgFor],
  templateUrl: './cours-langue.component.html',
  styleUrl: './cours-langue.component.scss'
})
export class CoursLangueComponent {
  features = [
    "Conversation et expression orale",
    "Grammaire et vocabulaire",
    "Préparation aux certifications",
    "Ateliers d'immersion",
    "Méthodes interactives"
  ];
}
