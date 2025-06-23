import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment/environment';
import { Subject } from 'rxjs';
import { MatModule } from 'app/mat.module';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-upload',
    standalone: true,
    imports: [CommonModule, MatModule],  // Modules nécessaires pour ce composant autonome
    templateUrl: './upload-photo.component.html',
    styleUrls: ['./upload-photo.component.scss']
})
export class UploadPhotoComponent {
    // Chemin de base vers les images (extrait de l'environnement)
    environmentUrl = environment.url;

    // Variables d'état du composant
    selectedFile: File | null = null;        // Fichier sélectionné
    previewUrl: any = null;                  // Aperçu de l'image sélectionnée
    imageUrl = "";                           // URL complète de l'image (non utilisé ici)
    isLoading: boolean = false;              // Indique si le chargement est en cours
    uploaded: boolean;                       // Indique si une image est déjà présente
    pictureUrl: string;                      // Stocke l'URL (non utilisée ici)
    Url: SafeUrl;                            // URL sécurisée pour affichage

    // Entrées / sorties Angular
    @Output() dataEvent = new EventEmitter<any>();  // Émet le fichier sélectionné au parent
    @Input() image: string;                         // Nom du fichier image (existant)
    @Input() folder: string;                        // Nom du dossier où est stockée l’image

    // Services injectés
    private cdr = inject(ChangeDetectorRef);         // Pour forcer la détection des changements
    private _unsubscribeAll = new Subject<any>();    // Pour nettoyage des subscriptions
    private sanitizer = inject(DomSanitizer);        // Pour sécuriser l’URL des images

    // Lors de l'initialisation du composant
    ngOnInit(): void {
        // Détermine si une image est déjà présente
        this.uploaded = !(this.image === null || this.image === undefined);

        // Génère une URL sécurisée pour afficher l’image existante
        this.Url = this.sanitizer.bypassSecurityTrustUrl(`${this.environmentUrl}/${this.folder}/${this.image}`);
    }

    // Permet de réinitialiser l’état pour modifier l’image
    modifyIMage(): void {
        this.uploaded = false;
        this.image = "";
    }

    // Ouvre la boîte de sélection de fichier
    openInput(inputElement: HTMLInputElement): void {
        inputElement.click();
    }

    // Méthode appelée lorsque l'utilisateur sélectionne un fichier
    onFileSelected(event: Event): void {
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];

        if (file) {
            this.isLoading = true;
            this.selectedFile = file;
            this.preview();  // Lance l’aperçu de l’image
        }
    }

    // Supprime l’image sélectionnée ou existante
    remove(): void {
        this.uploaded = false;
        this.previewUrl = null;
        this.image = null;

        // Informe le composant parent que l'image a été supprimée
        this.dataEvent.emit(null);

        this.cdr.markForCheck();  // Force la mise à jour de la vue
    }

    // Génère un aperçu de l’image si le fichier est bien une image
    preview(): void {
        const mimeType = this.selectedFile?.type;

        if (!mimeType?.startsWith('image/')) {
            return;  // Ne rien faire si ce n'est pas une image
        }

        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile!);  // Convertit l’image en base64
        this.uploaded = true;

        reader.onload = () => {
            this.previewUrl = reader.result as string;
            this.isLoading = false;

            this.cdr.markForCheck();               // Met à jour la vue
            this.dataEvent.emit(this.selectedFile);  // Envoie l’image au parent
        };
    }

    // Nettoie les abonnements à la destruction du composant
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
}
