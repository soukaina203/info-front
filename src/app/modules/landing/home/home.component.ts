import { Component, ViewEncapsulation } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { CtaComponent } from '../cta/cta.component';
import { TestimonialComponent } from '../testimonial/testimonial.component';
import { ServicesComponent } from '../services/services.component';
import { HeroComponent } from '../hero/hero.component';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'landing-home',
    templateUrl: './home.component.html',
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [MatButtonModule, RouterLink, MatIconModule,ServicesComponent
        ,CtaComponent,TestimonialComponent,
    HeroComponent,HeaderComponent,FooterComponent,CommonModule
    ],
    styleUrls: ['./home.component.scss'],


})
export class LandingHomeComponent {
    /**
     * Constructor
     */
    constructor() {}
}
