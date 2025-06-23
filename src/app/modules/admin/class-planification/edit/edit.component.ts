// Importations Angular, services, modèles et composants nécessaires
import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UowService } from 'app/services/uow.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatModule } from 'app/mat.module';
import { MatButtonModule } from '@angular/material/button';
import { Speciality } from 'app/models/Speciality';
import { Niveau } from 'app/models/Niveau';
import { Method } from 'app/models/Method';
import { Service } from 'app/models/Service';
import { MatDialog } from '@angular/material/dialog';
import { UploadPhotoComponent } from '../../upload-photo/upload-photo.component';
import { Class } from 'app/models/Class';

@Component({
    selector: 'app-edit',
    standalone: true,
    // Modules nécessaires à ce composant standalone
    imports: [
        CommonModule,
        FormsModule,
        MatButtonModule,
        UploadPhotoComponent,
        ReactiveFormsModule,
        RouterLink,
        MatModule
    ],
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent {
    // Référence vers le template de la popup
    @ViewChild('popupTemplate') popupTemplate!: TemplateRef<any>;

    // Propriétés pour la logique du composant
    id: string;
    selectedFile: File | null = null;
    myForm: FormGroup;
    CvTitle: string = '';
    CvExists: boolean;
    oldPassword: string;
    oldCv: string;
    class: Class;

    // Données liées aux options disponibles
    services: Service[] = [];
    methods: Method[] = [];
    niveaux: Niveau[] = [];
    specialities: Speciality[] = [];

    // Pour afficher les messages d’erreur dans la popup
    PoppupContent: string = '';
    CvFile: File;

    // Injection des services Angular
    private uow = inject(UowService);
    private fb = inject(FormBuilder);
    private dialog = inject(MatDialog);
    private router = inject(Router);
    private route = inject(ActivatedRoute);

    // Initialisation du composant
    ngOnInit(): void {
        // Récupération de l'ID depuis l'URL
        this.id = this.route.snapshot.paramMap.get('id');

        // Récupération des données de la classe depuis l’API
        this.uow.classes.getOne(parseInt(this.id)).subscribe((res: { data: Class }) => {
            this.class = res.data;
            this.createForm();
        });
    }

    // Réception du fichier depuis le composant enfant
    receiveData(data: any) {
        this.selectedFile = data;
    }

    // Récupération des services et options associés à l’utilisateur enseignant
    GetTeacherRelativeData() {
        this.uow.auth.getServicesData().subscribe((res) => {
            this.services = res.services;
            this.specialities = res.specialities;
            this.methods = res.methods;
            this.niveaux = res.niveaux;
        });
    }

    // Sélection d’un fichier PDF pour un CV
    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            const fileType = file.type;
            const fileName = file.name;

            // Vérifie si le fichier est bien un PDF
            if (fileType === 'application/pdf') {
                this.CvTitle = fileName;
                this.CvFile = file;
            } else {
                // Affiche une popup si le fichier est invalide
                this.PoppupContent = "Le téléchargement de la photo de profil a échoué, réessayez";
                this.showPoppup();
            }
        }
    }

    // Affiche une popup personnalisée
    showPoppup(): void {
        const dialogRef = this.dialog.open(this.popupTemplate, {
            height: '200px',
            width: '500px'
        });
        dialogRef.afterClosed().subscribe(() => {});
    }

    // Création du formulaire avec initialisation des champs
    createForm() {
        let user = JSON.parse(localStorage.getItem("user"));
        this.myForm = this.fb.group({
            id: [this.class.id || 0],
            title: [this.class.title, [Validators.required, Validators.minLength(3)]],
            duree: [this.class.duree, [Validators.required]],
            date: [this.class.date, [Validators.required, Validators.minLength(3)]],
            link: [
                this.class.link,
                [Validators.pattern(/^(https:\/\/).*$/), Validators.required]
            ],
            description: [this.class.description, [Validators.required]],
            picture: [this.class.picture, [Validators.required]],
            userId: this.class.userId
        });
    }

    // Ouvre un input file manuellement
    openInput(o) {
        o.click();
    }

    // Affiche une popup d'erreur
    ErrorPoppup(): void {
        const dialogRef = this.dialog.open(this.popupTemplate, {
            height: '200px',
            width: '500px'
        });
        dialogRef.afterClosed().subscribe(() => {});
    }

    // Mise à jour d'une réunion (classe virtuelle)
    updatereunion(classe) {
        if (this.selectedFile) {
            // Si une nouvelle image est sélectionnée, on la téléverse avant mise à jour
            this.uow.upload.uploadFile(this.selectedFile, "classes").subscribe((res) => {
                classe.picture = res.fileName;
                this.uow.classes.put(this.id, classe).subscribe((res: { message: string }) => {
                    if (res.message === "success") {
                        this.router.navigate(["/user/planification"]);
                    } else {
                        this.PoppupContent = "Erreur lors de l'enregistrement des modifications, réessayez";
                        this.ErrorPoppup();
                    }
                });
            });
        } else {
            // Si aucune image n'est modifiée, mise à jour directe
            this.uow.classes.put(this.id, classe).subscribe((res: { message: string }) => {
                if (res.message === "success") {
                    this.router.navigate(["/user/planification"]);
                } else {
                    this.PoppupContent = "Erreur lors de l'enregistrement des modifications, réessayez";
                    this.ErrorPoppup();
                }
            });
        }
    }
}
