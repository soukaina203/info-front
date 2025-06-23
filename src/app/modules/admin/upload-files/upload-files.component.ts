import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FuseAlertType } from '@fuse/components/alert';
import { MatModule } from 'app/mat.module';

@Component({
    selector: 'app-upload-files',
    standalone: true,
    imports: [CommonModule, MatModule],         // Modules Angular importés dans ce composant autonome
    templateUrl: './upload-files.component.html',
    styleUrl: './upload-files.component.scss'
})
export class UploadFilesComponent {

    @Input() CvTitle: string = '';              // Titre du CV affiché (nom du fichier)
    @Output() CvFile = new EventEmitter<File>();    // Émet le fichier sélectionné vers le parent
    @Output() newCvTitle = new EventEmitter<string>();  // Émet le nouveau nom du CV sélectionné

    oldCv = '';                                 // Ancien nom de fichier (non utilisé ici)
    CvExists = false;                           // Booléen indiquant si un CV existe (non utilisé ici)
    isShow = false;                             // Variable pour contrôle d’affichage (non utilisée)
    showAlert = false;                          // Contrôle l’affichage de l’alerte d’erreur
    selectedFile: File | null = null;           // Fichier sélectionné actuellement

    // Objet pour gérer le type et message de l’alerte
    alert: { type: FuseAlertType; message: string } = {
        type: "success",
        message: '',
    };

    // Méthode pour déclencher le clic sur l’input fichier caché
    openInput(o) {
        o.click();
    }

    // Méthode pour supprimer le CV sélectionné (reset le titre)
    removeCV() {
        this.CvTitle = "";
    }

    // Méthode appelée lors de la sélection d’un fichier dans l’input
    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            const fileType = file.type;
            const fileName = file.name;

            // Vérifie que le fichier est un PDF
            if (fileType === 'application/pdf') {

                this.newCvTitle.emit(file.name);  // Envoie le nom du fichier vers le parent
                this.CvFile.emit(file);            // Envoie le fichier vers le parent
                this.CvTitle = fileName;           // Met à jour le titre affiché
                this.showAlert = false;            // Cache l’alerte

            } else {
                // Affiche une alerte d’erreur si le type de fichier n’est pas valide
                this.alert.type = 'error';
                this.alert.message = 'Type de fichier non valide. Veuillez télécharger un fichier PDF.';
                this.showAlert = true;
            }
        }
    }

}
