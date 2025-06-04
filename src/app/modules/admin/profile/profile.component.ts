import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';

import { saveAs } from "file-saver";

// Services
import { UowService } from 'app/services/uow.service';

// Models
import { User } from 'app/models/User';
import { Speciality } from 'app/models/Speciality';
import { Niveau } from 'app/models/Niveau';
import { Method } from 'app/models/Method';
import { Service } from 'app/models/Service';
import { ProfProfile } from 'app/models/ProfProfile';
import { inscriptionProfInterface } from 'app/interfaces/inscriptionProf';

// Components
import { PoppupComponent } from 'app/modules/shared/poppup/poppup.component';
import { MatModule } from 'app/mat.module';

// Types
import { FuseAlertType } from '@fuse/components/alert';
import { Router } from '@angular/router';
import { UploadPhotoComponent } from '../upload-photo/upload-photo.component';
import { UploadFilesComponent } from '../upload-files/upload-files.component';
import { extractProfProfileFromForm, extractUserFromForm } from 'app/utils/form-mappers';

@Component({
    selector: 'app-profil',
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
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class ProfileComponent {


    private uow = inject(UowService)
    private fb = inject(FormBuilder)
    private dialog = inject(MatDialog)
    private router = inject(Router)


    CvFile: File | null = null;
    selectedFile: File | null = null;
    myForm: FormGroup;

    CvExists = false;
    isShow = false;
    showAlert = false;

    oldPassword = '';
    oldCv = '';
    CvTitle = '';



    services: Service[] = []
    methods: Method[] = []
    niveaux: Niveau[] = []
    specialities: Speciality[] = []


    user: User = new User
    prof: ProfProfile = new ProfProfile

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };

    create() {
        this.myForm = this.fb.group({
            id: this.user.id,
            firstName: [this.user.firstName, [Validators.required, Validators.minLength(3)]],
            lastName: [this.user.lastName, [Validators.required, Validators.minLength(3)]],
            email: [this.user.email, [Validators.email, Validators.required]],
            password: [this.user.password], // to be removed pwds should not be returned
            telephone: [this.user.telephone, [Validators.required, Validators.pattern(/^(06|07)\d{8}$/)]],
            roleId: this.user.roleId,

            city: [this.prof.city, [Validators.minLength(2)]],
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
        if (!userIdRaw) { // means that the user is not autheticated
            this.router.navigateByUrl('sign-in');
            return;
        }

        const userId = JSON.parse(userIdRaw);

        this.uow.users.GetUserById(userId).subscribe((res: any) => {
            this.user = res.user;

            if (this.user.roleId === 1) {
                this.prof = res.profProfile;
                this.CvTitle = res.profProfile.cv;
                this.oldCv = res.profProfile.cv
            }

            this.create();
        });

        this.uow.service.getServicesData().subscribe((res) => {
            this.services = res.services;
            this.specialities = res.specialities;
            this.methods = res.methods;
            this.niveaux = res.niveaux;

        });
    }



    receiveData(data: any) {
        this.selectedFile = data
    }

    update() {

        const formValue = this.myForm.getRawValue();
        const user = extractUserFromForm(formValue);
        const profProfile = extractProfProfileFromForm(formValue);

        if (this.CvTitle === "" && this.user.roleId === 1) {
            this.openPopup('Veuillez ajouter votre CV', 'text-red-600');

        } else {

            if (this.selectedFile) { // for pictures
                this.uow.upload.uploadFile(this.selectedFile, "photos").subscribe((res: any) => {
                    user.photo = res.fileName;
                    this.continueUpdate(user, profProfile);
                });


            } else if (this.user.roleId === 1 && this.oldCv !== this.CvTitle && this.CvTitle !== "") { // this for cv

                this.uow.upload.putFile("cvs", this.oldCv, this.CvFile).subscribe((res: any) => {

                    if (res.message === "success") {
                        this.CvTitle = res
                        profProfile.cv = res.file
                        this.continueUpdate(user, profProfile);
                    } else {
                        this.openPopup('Erreur lors de telechargement de PDF , veullez ressayer', 'text-red-600');

                    }
                });
            } else {
                this.continueUpdate(user, profProfile);
            }
        }

    }

    onCvFileSelected(file: File): void {
        this.CvFile = file;
    }

    onCvTitleChanged(title: string): void {
        this.CvTitle = title;
    }

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




    openPopup(message: string, textColor: string = 'text-[#2E849D]',
         height: string = '200px'): void {
        // this.poppup.
        const dialogRef = this.dialog.open(PoppupComponent, {
            width: '500px',
            height: height,
            data: {
                message: message,
                textColor: textColor
            }
        });

        dialogRef.afterClosed().subscribe(result => {
        });
    }




}
