import { Component, TemplateRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UowService } from 'app/services/uow.service';
import { User } from 'app/models/User';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatModule } from 'app/mat.module';
import { MatButtonModule } from '@angular/material/button';
import { Speciality } from 'app/models/Speciality';
import { Niveau } from 'app/models/Niveau';
import { Method } from 'app/models/Method';
import { Service } from 'app/models/Service';
import { MatDialog } from '@angular/material/dialog';
import { saveAs } from "file-saver";
import { UploadFilesComponent } from '../../upload-files/upload-files.component';
import { Class } from 'app/models/Class';
import { UploadPhotoComponent } from '../../upload-photo/upload-photo.component';
import { NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';

@Component({
    selector: 'app-create',
    standalone: true,
    imports: [CommonModule, FormsModule,
    MatButtonModule, UploadPhotoComponent,NgxMatTimepickerModule ,
    ReactiveFormsModule, MatModule],

    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss']
})
export class CreateComponent {
    @ViewChild('popupTemplate') popupTemplate!: TemplateRef<any>;


    selectedFile: File | null = null;

    myForm: FormGroup;
    CvTitle: string = ''

    CvExists: boolean
    oldPassword: string
    oldCv: string
    reunion: Class = new Class()

    services: Service[] = []
    methods: Method[] = []
    niveaux: Niveau[] = []
    specialities: Speciality[] = []
    PoppupContent: string = ''
    CvFile: File

    private uow = inject(UowService)
    private fb = inject(FormBuilder)
    private dialog = inject(MatDialog)
    private router= inject(Router)

    createForm() {
        let user = JSON.parse(localStorage.getItem("userData"))
        this.myForm = this.fb.group({
            id: [this.reunion.id||0],
            title: [this.reunion.title, [Validators.required, Validators.minLength(3)]],
            duree: [this.reunion.duree, [Validators.required]],
            date: [this.reunion.date, [Validators.required, Validators.minLength(3)]],
            link: [
                this.reunion.link,
                [
                    Validators.pattern(/^(https:\/\/).*$/),
                    Validators.required
                ]
            ],
            description: [this.reunion.description, [Validators.required]],
            picture: [this.reunion.picture ],
            userId:user.id
        });
    }

    ngOnInit(): void {
        this.createForm();
    }

    receiveData(data: any) {
        this.selectedFile = data
        console.log("picture")
        console.log(this.selectedFile)
    }

    GetTeacherRelativeData() {
        this.uow.auth.getServicesData().subscribe((res) => {
            this.services = res.services;
            this.specialities = res.specialities;
            this.methods = res.methods;
            this.niveaux = res.niveaux;
        })
    }

    onFileSelected(event: Event) {
        console.log("hello")
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            const fileType = file.type;
            const fileName = file.name;

            if (fileType === 'application/pdf') {
                this.CvTitle = fileName;
                this.CvFile = file;
            } else {

                this.PoppupContent="Le téléchargement de la photo de profil a échoué,réessayez"
                this.showPoppup()

            }
        }
    }

    openInput(o) {
        o.click();
    }

    showPoppup(): void {
        const dialogRef = this.dialog.open(this.popupTemplate, {
            height: '200px',
            width: '500px'
        });
        dialogRef.afterClosed().subscribe((result) => {
        });
    }

    save(classe: Class) {
        if (this.myForm.valid) {


        if (this.selectedFile) {
            this.uow.upload.uploadFile(this.selectedFile, "classes").subscribe((res) => {
                classe.picture = res.fileName
                this.uow.classes.post(classe).subscribe((res: any) => {
                    if (res.message === "success") {
                        this.router.navigate(['/user/planification']);
                    } else {
                        this.PoppupContent = "Échec de l'enregistrement des modifications, réessayez plus tard";
                    }
                });
            })
        }
 }
    }


}
