import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent {
    scrollTo(section: any) {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' ,  block: 'start'
 });
    }

}
