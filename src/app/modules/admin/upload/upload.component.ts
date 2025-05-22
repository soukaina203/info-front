import { ChangeDetectorRef, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environment/environment';
import { Subject } from 'rxjs';
import { MatModule } from 'app/mat.module';

@Component({
    selector: 'app-upload',
    standalone: true,
    imports: [CommonModule, MatModule],
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss']
})
export class UploadComponent {
    environmentUrl = environment.url
    selectedFile: File | null = null;
    previewUrl: any = null;
    imageUrl = ""
    isLoading: boolean = false
    uploaded: boolean
    pictureUrl: string

    @Output() dataEvent = new EventEmitter<any>();
    @Input() image: string;
    @Input() folder: string;

    private cdr = inject(ChangeDetectorRef);
    private _unsubscribeAll = new Subject<any>();


    ngOnInit(): void {
        // Initialise l'état d'upload selon la présence d'une image existante

        console.log("Coming image ")
        console.log(this.image)
        this.uploaded = !(this.image === null || this.image === undefined);
    }

    modifyIMage(): void {
        // Permet de réinitialiser l'image pour en uploader une nouvelle
        this.uploaded = false;
        this.image = "";
    }

    openInput(inputElement: HTMLInputElement): void {
        // Ouvre la boîte de dialogue pour sélectionner un fichier
        inputElement.click();
    }

    onFileSelected(event: Event): void {
        // Gère la sélection de fichier et déclenche l'aperçu
        const target = event.target as HTMLInputElement;
        const file = target.files?.[0];
        if (file) {
            this.isLoading = true;
            this.selectedFile = file;
            this.preview();
        }
    }

    remove(): void {
        // Supprime l'image actuellement sélectionnée ou existante
        this.uploaded = false;
        this.previewUrl = null;
        this.image = null;
        this.dataEvent.emit(null);
        this.cdr.markForCheck();
    }

    preview(): void {
        // Affiche un aperçu de l'image sélectionnée si c'est bien un fichier image
        const mimeType = this.selectedFile?.type;
        if (!mimeType?.startsWith('image/')) {
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(this.selectedFile!);
        this.uploaded = true;

        reader.onload = () => {
            this.previewUrl = reader.result as string;
            this.isLoading = false;
            this.cdr.markForCheck();
            this.dataEvent.emit(this.selectedFile);
        };
    }

    ngOnDestroy(): void {
        // Nettoie les abonnements lors de la destruction du composant
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

}
