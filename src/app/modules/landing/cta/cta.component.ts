import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cta',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './cta.component.html',
  styleUrl: './cta.component.scss'
})
export class CtaComponent {
   scrollTo(section: any) {
        document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' ,  block: 'start'
 });
    }
}
