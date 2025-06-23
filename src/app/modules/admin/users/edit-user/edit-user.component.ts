// Import des fonctionnalités de base d’Angular
import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// Formulaires réactifs et validation
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

// Routage Angular
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Router } from '@angular/router';

// Dialogues modaux (boîtes de dialogue Angular Material)
import { MatDialog } from '@angular/material/dialog';

// Modules Angular Material utilisés (boutons, champs, icônes…)
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

// Pour sauvegarder un fichier localement (CV, par exemple)
import { saveAs } from "file-saver";

// Services personnalisés
import { UowService } from 'app/services/uow.service';

// Modèles de données
import { User } from 'app/models/User';
import { Speciality } from 'app/models/Speciality';
import { Niveau } from 'app/models/Niveau';
import { Method } from 'app/models/Method';
import { Service } from 'app/models/Service';
import { ProfProfile } from 'app/models/ProfProfile';

// Interface pour la structure de l’inscription professeur
import { inscriptionProfInterface } from 'app/interfaces/inscriptionProf';

// Composant de popup personnalisé
import { PoppupComponent } from 'app/modules/shared/poppup/poppup.component';

// Module Angular Material centralisé (probablement personnalisé pour l'app)
import { MatModule } from 'app/mat.module';

// Types pour les alertes (de @fuse, une base de design system)
import { FuseAlertType } from '@fuse/components/alert';

// Fonctions utilitaires pour extraire les données du formulaire
import { extractProfProfileFromForm, extractUserFromForm } from 'app/utils/form-mappers';

// Composants enfants pour le téléchargement de photo et de CV
import { UploadPhotoComponent } from '../../upload-photo/upload-photo.component';
import { UploadFilesComponent } from '../../upload-files/upload-files.component';

@Component({
    selector: 'app-edit',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterLink,
        UploadPhotoComponent,
        UploadFilesComponent,
        MatButtonModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatModule,
        PoppupComponent
    ],
    templateUrl: './edit-user.component.html',
    styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent {
    // Injection des services
    private uow = inject(UowService);
    private fb = inject(FormBuilder);
    private dialog = inject(MatDialog);
    private route = inject(ActivatedRoute);

    // Fichier et données du formulaire
    CvFile: File | null = null;
    selectedFile: File | null = null;
    myForm: FormGroup;

    // État des champs
    CvExists = false;
    isShow = false;
    showAlert = false;

    // Données utilisateurs
    oldPassword = '';
    oldCv = '';
    CvTitle = '';

    // Données utilisées dans les listes déroulantes
    services: Service[] = [];
    methods: Method[] = [];
    niveaux: Niveau[] = [];
    specialities: Speciality[] = [];

    user: User = new User;
    prof: ProfProfile = new ProfProfile;

    // Message d'alerte
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };

    // Création du formulaire réactif avec validation
    create() {
        this.myForm = this.fb.group({
            id: this.user.id,
            firstName: [this.user.firstName, [Validators.required, Validators.minLength(3)]],
            lastName: [this.user.lastName, [Validators.required, Validators.minLength(3)]],
            email: [this.user.email, [Validators.email, Validators.required]],
            password: [this.user.password],
            telephone: [this.user.telephone, [Validators.required, Validators.pattern(/^(06|07)\d{8}$/)]],
            roleId: this.user.roleId,
            Status: this.user.status,

            city: [this.prof.city, [Validators.minLength(2)]],
            cv: [this.prof.cv],
            photo: [this.user.photo],

            services: [this.prof.services, [Validators.required]],
            specialities: [this.prof.specialities, [Validators.required]],
            niveaux: [this.prof.niveaux, [Validators.required]],
            methodes: [this.prof.methodes, [Validators.required]],
        });
    }

    // Téléchargement du fichier CV depuis le backend
    download() {
        this.uow.upload.downloadFile("cvs", this.prof.cv).subscribe(data =>
            saveAs(data, `${this.user.lastName} ${this.user.firstName}.pdf`)
        );
    }

    // Initialisation des données à l’ouverture du composant
    ngOnInit(): void {
        const userId = parseInt(this.route.snapshot.paramMap.get('id'));

        this.uow.users.GetUserById(userId).subscribe((res: any) => {
            this.user = res.user;

            // Si c’est un professeur, récupérer aussi le profil
            if (this.user.roleId === 1) {
                this.prof = res.profProfile;
                this.CvTitle = res.profProfile.cv;
                this.oldCv = res.profProfile.cv;
            }

            this.create();
        });

        // Chargement des données pour les sélections
        this.uow.service.getServicesData().subscribe((res) => {
            this.services = res.services;
            this.specialities = res.specialities;
            this.methods = res.methods;
            this.niveaux = res.niveaux;
        });
    }

    // Réception de l’image uploadée depuis le composant enfant
    receiveData(data: any) {
        this.selectedFile = data;
    }

    // Action de mise à jour de l’utilisateur
    update() {
        const formValue = this.myForm.getRawValue();
        const user = extractUserFromForm(formValue);
        const profProfile = extractProfProfileFromForm(formValue);

        // Vérification du CV pour les professeurs
        if (this.CvTitle === "" && this.user.roleId === 1) {
            this.openPopup('Veuillez ajouter votre CV', 'text-red-600');
        } else {
            if (this.selectedFile) {
                // Upload de la photo de profil
                this.uow.upload.uploadFile(this.selectedFile, "photos").subscribe((res: any) => {
                    user.photo = res.fileName;
                    this.continueUpdate(user, profProfile);
                });
            } else if (this.user.roleId === 1 && this.oldCv !== this.CvTitle && this.CvTitle !== "") {
                // Remplacement du fichier CV
                this.uow.upload.putFile("cvs", this.oldCv, this.CvFile).subscribe((res: any) => {
                    if (res.message === "success") {
                        this.CvTitle = res;
                        profProfile.cv = res.file;
                        this.continueUpdate(user, profProfile);
                    } else {
                        this.openPopup('Erreur lors de téléchargement du PDF, veuillez réessayer', 'text-red-600');
                    }
                });
            } else {
                this.continueUpdate(user, profProfile);
            }
        }
    }

    // Lorsqu’un nouveau fichier CV est sélectionné
    onCvFileSelected(file: File): void {
        this.CvFile = file;
    }

    // Lorsqu’un nouveau nom de CV est défini
    onCvTitleChanged(title: string): void {
        this.CvTitle = title;
    }

    // Envoie la mise à jour vers le backend
    continueUpdate(user: User, profProfile: ProfProfile) {
        const dataToSend: inscriptionProfInterface = {
            user: user,
            profProfile: this.user.roleId === 1 ? profProfile : null
        };

        this.uow.users.put(user.id, dataToSend).subscribe((res: any) => {
            if (res.code === 200) {
                this.user = res.userData;
                this.openPopup('Profil mis à jour');
                this.uow.users.currentUser$.next(res.userData);
                localStorage.setItem('user', JSON.stringify(res.userData));
            } else {
                this.openPopup("Échec de l'enregistrement des modifications, réessayez plus tard", 'text-red-600');
            }
        });
    }

    // Affiche une popup de message
    openPopup(
        message: string,
        textColor: string = 'text-[#2E849D]',
        height: string = '200px'
    ): void {
        this.dialog.open(PoppupComponent, {
            width: '500px',
            height: height,
            data: { message: message, textColor: textColor }
        });
    }
}
