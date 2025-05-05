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
        firstName: ['', [Validators.required, Validators.minLength(3)]],
        lastName: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.email, Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
        telephone: ['', [Validators.required, Validators.pattern(/^(06|07)\d{8}$/)]],
        idRole: 1,
        isAdmin: false,
        city: ['', [Validators.required, Validators.minLength(2)]],
        cv: [''],
        photo: [null],

        services: [[], [Validators.required]],
        specialities: [[], [Validators.required]],
        niveaux: [[], [Validators.required]],
        methodes: [[], [Validators.required]],
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

    openInput(o) {
        o.click();
    }

    openCvRequiredPoppup(): void {
        const dialogRef = this.dialog.open(this.PdfRequiredPoppup, {
            height: '340px',
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

    removeCV() {
        this.CvTitle = ""
    }

    signIn(): void {
        const user = this.myForm.getRawValue() as unknown as User;


    }
}
