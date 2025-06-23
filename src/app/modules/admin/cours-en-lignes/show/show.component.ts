import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Class } from 'app/models/Class';
import { UowService } from 'app/services/uow.service';
import { environment } from 'environment/environment';

@Component({
    selector: 'app-show',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './show.component.html',
    styleUrl: './show.component.scss'
})
export class ShowComponent {
    // Injection des services nécessaires : route (pour récupérer l'id), UowService (pour les données), DomSanitizer (pour sécuriser l'URL de l'image)
    private route = inject(ActivatedRoute)
    private uow = inject(UowService)
    private sanitizer = inject(DomSanitizer)

    // URL de base définie dans les variables d'environnement
    environment = environment.url

    // Variable pour stocker l'URL sécurisée de l'image
    Url: SafeUrl

    // Identifiant de la classe à afficher et objet classe
    id: string
    class: Class

    // Méthode appelée à l'initialisation du composant
    ngOnInit() {
        // Récupération de l'ID depuis l'URL et appel du service pour récupérer les données de la classe
        this.id = this.route.snapshot.paramMap.get('id');
        this.uow.classes.getOne(parseInt(this.id)).subscribe((res: { data: Class }) => {
            this.class = res.data

            // Génération d'une URL sécurisée pour afficher l'image de la classe
            this.Url = this.sanitizer.bypassSecurityTrustUrl(`${this.environment}/classes/${this.class.picture}`)
        })
    }
}
