import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
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

@Component({
    selector: 'app-profil',
    standalone: true,
    imports: [CommonModule, FormsModule, MatButtonModule
        , ReactiveFormsModule, RouterLink],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {

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
    myForm: FormGroup;

    services: Service[] = []
    methods: Method[] = []
    niveaux: Niveau[] = []
    specialities: Speciality[] = []
    isShow: boolean = false
    user: User = new User
    showAlert: boolean = false;

    CvExists: boolean
    oldPassword: string
    oldCv: string

    PoppupContent: string = ''



    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };

    create() {
        this.myForm = this.fb.group({
            id: 0,
            firstName: ['', [Validators.required, Validators.minLength(3)]],
            lastName: ['', [Validators.required, Validators.minLength(3)]],
            email: ['', [Validators.email, Validators.required]],
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
            telephone: ['', [Validators.required, Validators.pattern(/^(06|07)\d{8}$/)]],
            roleId: 1,
            isAdmin: false,
            city: ['f', [Validators.required, Validators.minLength(2)]],
            cv: [''],
            photo: [null],

            services: [[], [Validators.required]],
            specialities: [[], [Validators.required]],
            niveaux: [[], [Validators.required]],
            methodes: [[], [Validators.required]],
            userId: 0, // assigne dans le backend
            user: null
        });
    }




    ngOnInit(): void {

        let user = JSON.parse(localStorage.getItem("user"))
        console.log(user)
        this.uow.users.getOne(user.id).subscribe((res) => {


        })
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
            photo,
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
