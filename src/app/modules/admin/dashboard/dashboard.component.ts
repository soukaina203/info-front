import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatModule } from 'app/mat.module';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatModule,NgFor , CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
 services = [
    {
      icon: 'book',
      title: 'Soutien scolaire',
      description: 'Cours particuliers adaptés à votre niveau',
      image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c',
      link: '/soutien-scolaire'
    },
    {
      icon: 'calendar_month',
      title: 'Activités scolaires',
      description: 'Ateliers créatifs et projets collaboratifs',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop',
      link: '/activites-scolaires'
    },
    {
      icon: 'language',
      title: 'Cours de langues',
      description: 'Anglais, français et espagnol interactifs',
      image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=250&fit=crop',
      link: '/cours-langues'
    }
  ];

  stats = [
    { icon: 'group', value: '750+', label: 'Étudiants actifs' },
    { icon: 'star', value: '4.9', label: 'Note moyenne' },
    { icon: 'schedule', value: '24/7', label: 'Support disponible' }
  ];

  constructor(private router: Router) {}

  navigateTo(link: string): void {
    this.router.navigate([link]);
  }
}
