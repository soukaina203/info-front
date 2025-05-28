import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FuseAlertType } from '@fuse/components/alert';
import { MatModule } from 'app/mat.module';

@Component({
    selector: 'app-upload-files',
    standalone: true,
    imports: [CommonModule, MatModule],
    templateUrl: './upload-files.component.html',
    styleUrl: './upload-files.component.scss'
})
export class UploadFilesComponent {

    @Input() CvTitle: string = '';
    @Output() CvFile = new EventEmitter<File>();
    @Output() newCvTitle = new EventEmitter<string>();

    oldCv = '';
    CvExists = false;
    isShow = false;
    showAlert = false;
    selectedFile: File | null = null;

    alert: { type: FuseAlertType; message: string } = {
        type: "success",
        message: '',
    };

    openInput(o) {
        o.click();
    }

    removeCV() {
        this.CvTitle = ""
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            const fileType = file.type;
            const fileName = file.name;

            if (fileType === 'application/pdf') {

                this.newCvTitle.emit(file.name);
                this.CvFile.emit(file);
                this.CvTitle = fileName;
                this.showAlert = false;

            } else {
                this.alert.type = 'error';
                this.alert.message = 'Type de fichier non valide. Veuillez télécharger un fichier PDF.'
                this.showAlert = true;

            }
        }
    }

}
