// Importations nécessaires Angular, services, composants et modèles utilisés dans ce composant
import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UowService } from 'app/services/uow.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatModule } from 'app/mat.module';
import { MatButtonModule } from '@angular/material/button';
import { Speciality } from 'app/models/Speciality';
import { Niveau } from 'app/models/Niveau';
import { Method } from 'app/models/Method';
import { Service } from 'app/models/Service';
import { MatDialog } from '@angular/material/dialog';
import { Class } from 'app/models/Class';
import { UploadPhotoComponent } from '../../upload-photo/upload-photo.component';
import { NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';

@Component({
    selector: 'app-create',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        UploadPhotoComponent,
        NgxMatTimepickerModule,
        ReactiveFormsModule,
        MatModule
    ],
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})
export class CreateComponent {
    // Référence au template de la popup
    @ViewChild('popupTemplate') popupTemplate!: TemplateRef<any>;

    // Variables pour la gestion du formulaire et des données
    selectedFile: File | null = null;
    myForm: FormGroup;
    CvTitle: string = '';
    CvExists: boolean;
    oldPassword: string;
    oldCv: string;
    reunion: Class = new Class();

    // Données récupérées pour les champs dynamiques
    services: Service[] = [];
    methods: Method[] = [];
    niveaux: Niveau[] = [];
    specialities: Speciality[] = [];
    PoppupContent: string = '';
    CvFile: File;

    // Injection de services Angular via `inject()`
    private uow = inject(UowService);
    private fb = inject(FormBuilder);
    private dialog = inject(MatDialog);
    private router = inject(Router);

    // Création du formulaire réactif avec validation
    createForm() {
        let user = JSON.parse(localStorage.getItem("userData"));
        this.myForm = this.fb.group({
            id: [this.reunion.id || 0],
            title: [this.reunion.title, [Validators.required, Validators.minLength(3)]],
            duree: [this.reunion.duree, [Validators.required]],
            date: [this.reunion.date, [Validators.required, Validators.minLength(3)]],
            link: [
                this.reunion.link,
                [Validators.pattern(/^(https:\/\/).*$/), Validators.required]
            ],
            description: [this.reunion.description, [Validators.required]],
            picture: [this.reunion.picture],
            userId: user.id
        });
    }

    // Initialisation du composant : création du formulaire
    ngOnInit(): void {
        this.createForm();
    }

    // Récupération du fichier image depuis le composant enfant
    receiveData(data: any) {
        this.selectedFile = data;
    }

    // Récupération des services, spécialités, méthodes et niveaux liés à l'utilisateur enseignant
    GetTeacherRelativeData() {
        this.uow.auth.getServicesData().subscribe((res) => {
            this.services = res.services;
            this.specialities = res.specialities;
            this.methods = res.methods;
            this.niveaux = res.niveaux;
        });
    }

    // Gestion du fichier CV sélectionné par l'utilisateur
    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            const fileType = file.type;
            const fileName = file.name;

            if (fileType === 'application/pdf') {
                this.CvTitle = fileName;
                this.CvFile = file;
            } else {
                // Affichage de la popup en cas d'erreur de type de fichier
                this.PoppupContent = "Le téléchargement de la photo de profil a échoué, réessayez";
                this.showPoppup();
            }
        }
    }

    // Permet d’ouvrir manuellement un champ input file
    openInput(o) {
        o.click();
    }

    // Affichage d'une popup de message (utilisé pour erreurs ou notifications)
    showPoppup(): void {
        const dialogRef = this.dialog.open(this.popupTemplate, {
            height: '200px',
            width: '500px'
        });
        dialogRef.afterClosed().subscribe((result) => {
            // Logique possible après fermeture de la popup
        });
    }

    // Sauvegarde de la réunion en envoyant les données au backend
    save(classe: Class) {
        if (this.myForm.valid) {
            if (this.selectedFile) {
                // Téléversement de l'image avant enregistrement
                this.uow.upload.uploadFile(this.selectedFile, "classes").subscribe((res) => {
                    classe.picture = res.fileName;
                    this.uow.classes.post(classe).subscribe((res: any) => {
                        if (res.message === "success") {
                            this.router.navigate(['/user/planification']);
                        } else {
                            this.PoppupContent = "Échec de l'enregistrement des modifications, réessayez plus tard";
                        }
                    });
                });
            }
        }
    }
}
