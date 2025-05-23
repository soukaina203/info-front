import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { UowService } from 'app/services/uow.service';
import { User } from 'app/models/User';
import { FormBuilder, FormGroup, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { Speciality } from 'app/models/Speciality';
import { Niveau } from 'app/models/Niveau';
import { Method } from 'app/models/Method';
import { Service } from 'app/models/Service';
import { MatDialog } from '@angular/material/dialog';
import { inscriptionProfInterface } from 'app/interfaces/inscriptionProf';
import { ProfProfile } from 'app/models/ProfProfile';
import { AuthService } from 'app/services/auth.service';
import { FuseAlertType } from '@fuse/components/alert';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { UploadComponent } from '../upload/upload.component';
import { MatModule } from 'app/mat.module';
import { saveAs } from "file-saver";

@Component({
    selector: 'app-profil',
    standalone: true,
    imports: [CommonModule, FormsModule, MatButtonModule, UploadComponent
        , ReactiveFormsModule, RouterLink, MatIconModule, MatFormFieldModule, MatModule, MatInputModule, NgIf,],


        templateUrl: './profile.component.html',
        styleUrls: ['./profile.component.scss']
    })
    export class ProfileComponent {

        @ViewChild('signInNgForm') signInNgForm: NgForm;
        @ViewChild('PdfRequiredPoppup') PdfRequiredPoppup!: TemplateRef<any>;
        @ViewChild('PdfErrorPoppup') PdfErrorPoppup!: TemplateRef<any>;
        @ViewChild('popupTemplate') popupTemplate!: TemplateRef<any>;
        @ViewChild('PhotoError') PhotoError!: TemplateRef<any>;

        private authService = inject(AuthService)
        private uow = inject(UowService)
        private router = inject(Router)
        private fb = inject(FormBuilder)
        private dialog = inject(MatDialog)

        CvTitle: string = ''
        CvFile: File
        myForm: FormGroup;

        services: Service[] = []
        methods: Method[] = []
        niveaux: Niveau[] = []
        specialities: Speciality[] = []
        isShow: boolean = false
        showAlert: boolean = false;
        selectedFile: File | null = null;

        CvExists: boolean
        oldPassword: string
        oldCv: string

        PoppupContent: string = ''
        user: User = new User
        prof: ProfProfile = new ProfProfile

        alert: { type: FuseAlertType; message: string } = {
            type: 'success',
            message: '',
        };
        // Form
        create() {
            this.myForm = this.fb.group({
                id: this.user.id,
                firstName: [this.user.firstName, [Validators.required, Validators.minLength(3)]],
                lastName: [this.user.lastName, [Validators.required, Validators.minLength(3)]],
                email: [this.user.email, [Validators.email, Validators.required]],
                password: [this.user.password], // to be removed pwds should not be returned
                telephone: [this.user.telephone, [Validators.required, Validators.pattern(/^(06|07)\d{8}$/)]],
                roleId: this.user.roleId,

                city: [this.prof.city, [ Validators.minLength(2)]],
                cv: [this.prof.cv],
                photo: [this.user.photo],

                services: [this.prof.services, [Validators.required]],
                specialities: [this.prof.specialities, [Validators.required]],
                niveaux: [this.prof.niveaux, [Validators.required]],
                methodes: [this.prof.methodes, [Validators.required]],
            });
        }

   download() {

        this.uow.upload.downloadFile("cvs", this.prof.cv).subscribe(data => saveAs(data, `${this.user.lastName} ${this.user.firstName}.pdf`))
    }


        ngOnInit(): void {
            const userIdRaw = localStorage.getItem("userId");
            if (!userIdRaw) {
                console.error("Aucun ID utilisateur trouvé dans le localStorage.");
                return;
            }

            const userId = JSON.parse(userIdRaw);

            // Récupération des infos utilisateur
            this.uow.users.getOne(userId).subscribe((res: any) => {
                this.user = res.user;

                if (this.user.roleId === 1) {
                    this.prof = res.profProfile;
                }

                this.create();
            });

            // Récupération des données de services
            this.uow.service.getServicesData().subscribe((res) => {
                this.services = res.services;
                this.specialities = res.specialities;
                this.methods = res.methods;
                this.niveaux = res.niveaux;
            }, (err) => {
                console.error("Erreur lors de la récupération des services :", err);
            });
        }



        receiveData(data: any) {

            this.selectedFile = data
        }





        update() {
            const formValue = this.myForm.getRawValue();
            const user = this.extractUserFromForm(formValue);
            const profProfile = this.extractProfProfileFromForm(formValue);

            if (this.selectedFile) {
                this.uow.upload.uploadFile(this.selectedFile , "photos").subscribe((res: any) => {
                    user.photo = res.fileName;
                    this.continueUpdate(user, profProfile);
                });
            } else if (this.user.roleId === 1 && this.oldCv !== this.CvTitle && this.CvTitle !== "") {
                this.uow.upload.putFile("cvs", this.oldCv, this.CvFile).subscribe((res: any) => {
                    if (res.message === "success") {
                        this.continueUpdate(user, profProfile);
                    } else {
                        this.CvUploadErrorPoppup();
                    }
                });
            } else {
                this.continueUpdate(user, profProfile);
            }
        }






        continueUpdate(user: User, profProfile: ProfProfile) {
            const dataToSend: inscriptionProfInterface = {
                user: user,
                ProfProfile: this.user.roleId === 1 ? profProfile : null
            };

            this.uow.users.put(user.id, dataToSend).subscribe((res: any) => {
                if (res.code === 200) {
                    this.user = res.userData;
                    console.log("==================")
                    console.log(res.user)
                    this.PoppupContent = 'Profil mis à jour';
                    this.ProfileEditedPoppup();
                    this.uow.users.currentUser$.next(res.userData);
                    localStorage.setItem('user', JSON.stringify(res.userData));
                } else {
                    this.PoppupContent = "Échec de l'enregistrement des modifications, réessayez plus tard";
                    this.ProfileEditedPoppup();
                }
            });
        }



        extractUserFromForm(formValue: any): User {
            return {
                id: formValue.id,
                firstName: formValue.firstName,
                lastName: formValue.lastName,
                email: formValue.email,
                telephone: formValue.telephone,
                password: formValue.password,
                photo: formValue.photo,
                roleId: formValue.roleId
            };
        }

        extractProfProfileFromForm(formValue: any): ProfProfile {
            return {
                city: formValue.city,
                cv: formValue.cv,
                services: formValue.services,
                specialities: formValue.specialities,
                niveaux: formValue.niveaux,
                methodes: formValue.methodes,
                userId: formValue.id,
                user: null // facultatif ou à adapter
            };
        }



        ProfileEditedPoppup(): void {
            const dialogRef = this.dialog.open(this.popupTemplate, {
                height: '200px',
                width: '500px'
            });
            dialogRef.afterClosed().subscribe((result) => {
            });
        }
        onFileSelected(event: Event) {
            const input = event.target as HTMLInputElement;
            if (input.files && input.files.length > 0) {
                const file = input.files[0];
                const fileType = file.type;
                const fileName = file.name;

                if (fileType === 'application/pdf') {
                    console.log('Selected file:', fileName);
                    this.CvTitle = fileName;
                    this.CvFile = file;
                    this.showAlert = false;

                } else {
                    console.error('Invalid file type. Please upload a PDF.');
                    this.alert = {
                        type: 'error',
                        message: 'Type de fichier non valide. Veuillez télécharger un fichier PDF.',
                    };
                    this.showAlert = true;

                }
            }
        }

        UploadPhotoErrorPoppup(): void {
            const dialogRef = this.dialog.open(this.PhotoError, {
                height: '200px',
                width: '500px'
            });
            dialogRef.afterClosed().subscribe((result) => {
            });
        }


        CvUploadErrorPoppup(): void {
            const dialogRef = this.dialog.open(this.PdfErrorPoppup, {
                height: '340px',
                width: '500px'
            });
            dialogRef.afterClosed().subscribe((result) => {
            });
        }


    }
