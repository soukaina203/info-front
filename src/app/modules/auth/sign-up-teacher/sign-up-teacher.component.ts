// angular
import { } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
// fuse
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
// models
import { Method } from 'app/models/Method';
import { User } from 'app/models/User';
import { Service } from 'app/models/Service';
import { Niveau } from 'app/models/Niveau';
import { Speciality } from 'app/models/Speciality';
// services
import { AuthService } from 'app/services/auth.service';
import { UowService } from 'app/services/uow.service';
// Materiel
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { inscriptionProfInterface } from 'app/interfaces/inscriptionProf';
import { ProfProfile } from 'app/models/ProfProfile';


@Component({
    selector: 'app-sign-up-teacher',
    standalone: true,
    imports: [RouterLink, CommonModule, FuseAlertComponent,
        MatButtonModule, MatIconModule,
        FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatInputModule],
    templateUrl: './sign-up-teacher.component.html',
    styleUrl: './sign-up-teacher.component.scss'
})
export class SignUpTeacherComponent {
    @ViewChild('signInNgForm') signInNgForm: NgForm;
    @ViewChild('PdfRequiredPoppup') PdfRequiredPoppup!: TemplateRef<any>;
    @ViewChild('PdfErrorPoppup') PdfErrorPoppup!: TemplateRef<any>;

    private authService = inject(AuthService)
    private uow = inject(UowService)
    private router = inject(Router)
    private fb = inject(FormBuilder)
    private dialog = inject(MatDialog)

    CvTitle: string = ''
    CvFile: File
    services: Service[] = []
    methods: Method[] = []
    niveaux: Niveau[] = []
    specialities: Speciality[] = []
    isShow: boolean = false
    user: User = new User
    showAlert: boolean = false;
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };


    myForm = this.fb.group({
        id: 0,
        firstName: ['hgfhg', [Validators.required, Validators.minLength(3)]],
        lastName: ['gfgf', [Validators.required, Validators.minLength(3)]],
        email: ['motoso5004@daupload.com', [Validators.email, Validators.required]],
        password: ['motoso5004@daupload.com', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['motoso5004@daupload.com', [Validators.required]],
        telephone: ['0625147896', [Validators.required, Validators.pattern(/^(06|07)\d{8}$/)]],
        roleId: 1,
        city: ['hgfhgf', [Validators.required, Validators.minLength(2)]],
        cv: [''],
        photo: [null],

        services: [[1], [Validators.required]],
        specialities: [[1], [Validators.required]],
        niveaux: [[1], [Validators.required]],
        methodes: [[1], [Validators.required]],
        userId: 0, // assigne dans le backend
        user: null
    });



    ngOnInit(): void {
        this.uow.service.getServicesData().subscribe((res) => {
            this.services = res.services;
            this.specialities = res.specialities;
            this.methods = res.methods;
            this.niveaux = res.niveaux;
        })
    }

    verify() {
        const user = this.myForm.getRawValue();
        user.password !== user.confirmPassword ? this.isShow = true : this.isShow = false
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
    // the order of functions executions
    signIn(): void {
        if (!this.CvFile) {
            this.openCvRequiredPoppup();
            return;
        }

        if (this.myForm.invalid) {
            return;
        }

        this.uploadCvAndRegister();
    }

    // upload of cvs
    private uploadCvAndRegister(): void {
        this.uow.upload.uploadFile(this.CvFile!).subscribe({
            next: (res) => {
                if (res.code !== 1) {

                    this.CvUploadErrorPoppup();
                    return;
                }

                const user = this.prepareUser(res.fileName);
                console.log(user)
                this.registerUser(user);
            },
            error: () => this.CvUploadErrorPoppup()
        });
    }

    // preparing objects
    private prepareUser(cvFileName: string): any {
        const formValue = this.myForm.getRawValue();
        const { confirmPassword, city, cv, photo, services, specialities, niveaux, methodes, userId, ...userFields } = formValue;

        const user: User = {
            ...userFields,
            roleId: formValue.roleId,
        };

        const ProfProfile: ProfProfile = {
            city,
            cv: cvFileName,
            services,
            specialities,
            niveaux,
            methodes,
            userId,
            user: null
        };

        const payload: inscriptionProfInterface = {
            user,
            ProfProfile
        };
        return payload;
    }

    // send the profProfile and user objects
    private registerUser(user: inscriptionProfInterface): void {
        this.myForm.disable();
        this.showAlert = false;
        this.authService.registerProf(user).subscribe({

            next: (res) => {
                this.myForm.enable();
                console.log("==============")
                console.log(res)
                if (res.code === -1) {
                    this.showAlert = true;
                    this.alert = {
                        type: 'error',
                        message: 'Email existe déjà',
                    };
                }
                localStorage.setItem('token', res.token)
                localStorage.setItem('userId', res.userId)
                this.router.navigateByUrl('verify/mail');

            },
            error: () => {
                this.myForm.enable();
                this.showAlert = true;
                this.alert = {
                    type: 'error',
                    message: 'Erreur lors de l’inscription. Veuillez réessayer.',
                };
            }
        });
    }

    private sendVerificationEmail(user: User): void {
        const fullName = `${user.lastName} ${user.firstName}`;
        const mailData = {
            toEmail: user.email,
            name: fullName,
            body: '',
            subject: "Vérifier votre adresse email pour compléter l'inscription"
        };

        this.uow.auth.SendVerificationMail(mailData).subscribe();
    }








    //poppups

    openInput(o) {
        o.click();
    }

    openCvRequiredPoppup(): void {
        const dialogRef = this.dialog.open(this.PdfRequiredPoppup, {
            height: '240px',
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
    closePoppup() {
        this.dialog.closeAll()
    }

    removeCV() {
        this.CvTitle = ""
    }


}
