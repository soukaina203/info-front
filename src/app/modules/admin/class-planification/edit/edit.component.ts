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
    imports: [CommonModule, FormsModule, MatButtonModule, UploadPhotoComponent, ReactiveFormsModule, RouterLink, MatModule],
    templateUrl: './edit.component.html',
    styleUrls: ['./edit.component.scss']
})
export class EditComponent {
    @ViewChild('popupTemplate') popupTemplate!: TemplateRef<any>;


    id: string
    selectedFile: File | null = null;

    myForm: FormGroup;
    CvTitle: string = ''

    CvExists: boolean
    oldPassword: string
    oldCv: string
    class: Class
    services: Service[] = []
    methods: Method[] = []
    niveaux: Niveau[] = []
    specialities: Speciality[] = []
    PoppupContent: string = ''
    CvFile: File

    private uow = inject(UowService)
    private fb = inject(FormBuilder)
    private dialog = inject(MatDialog)
    private router = inject(Router)


    private route = inject(ActivatedRoute);

    ngOnInit(): void {
        this.id = this.route.snapshot.paramMap.get('id');
        this.uow.classes.getOne(parseInt(this.id)).subscribe((res) => {
            this.class = res
            this.createForm()
        })

    }
    receiveData(data: any) {
        this.selectedFile = data
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

                this.PoppupContent = "Le téléchargement de la photo de profil a échoué,réessayez"
                this.showPoppup()

            }
        }
    }

    showPoppup(): void {
        const dialogRef = this.dialog.open(this.popupTemplate, {
            height: '200px',
            width: '500px'
        });
        dialogRef.afterClosed().subscribe((result) => {
        });
    }


    createForm() {
        let user = JSON.parse(localStorage.getItem("user"))
        this.myForm = this.fb.group({
            id: [this.class.id || 0],
            title: [this.class.title, [Validators.required, Validators.minLength(3)]],
            duree: [this.class.duree, [Validators.required]],
            date: [this.class.date, [Validators.required, Validators.minLength(3)]],
            link: [
                this.class.link,
                [
                    Validators.pattern(/^(https:\/\/).*$/),
                    Validators.required
                ]
            ],
            description: [this.class.description, [Validators.required]],
            picture: [this.class.picture, [Validators.required]],
            userId: user.id
        });
    }
    openInput(o) {
        o.click();
    }

    ErrorPoppup(): void {
        const dialogRef = this.dialog.open(this.popupTemplate, {
            height: '200px',
            width: '500px'
        });
        dialogRef.afterClosed().subscribe((result) => {
        });
    }

    updatereunion(classe) {
        if (this.selectedFile) {
            this.uow.upload.uploadFile(this.selectedFile, "classes").subscribe((res) => {
                classe.picture = res.fileName
                this.uow.classes.put(this.id, classe).subscribe((res:{message:string}) => {
                    if (res.message === "success") {
                        this.router.navigate(["/user/planification"])
                    } else {
                        this.PoppupContent = "erreur lors de l'enregistrement des modifications, réessayez"
                        this.ErrorPoppup()
                    }
                })
            })
        }else{
            this.uow.classes.put(this.id, classe).subscribe((res:{message:string}) => {
                if (res.message === "success") {
                    this.router.navigate(["/user/planification"])
                } else {
                    this.PoppupContent = "erreur lors de l'enregistrement des modifications, réessayez"
                    this.ErrorPoppup()
                }
            })
        }
    }



}
