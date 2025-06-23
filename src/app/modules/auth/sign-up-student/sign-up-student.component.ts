import { NgIf } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { FormBuilder, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { User } from 'app/models/User';
import { AuthService } from 'app/services/auth.service';
import { UowService } from 'app/services/uow.service';


@Component({
    selector: 'app-sign-up-student',
    standalone: true,
    imports: [RouterLink, FuseAlertComponent, NgIf,
        FormsModule, ReactiveFormsModule, MatFormFieldModule,
        MatInputModule, MatButtonModule, MatIconModule, MatCheckboxModule,
        MatProgressSpinnerModule],
    templateUrl: './sign-up-student.component.html',
    styleUrl: './sign-up-student.component.scss'
})
export class SignUpStudentComponent {
    // Référence au formulaire Angular
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    // Injection des services nécessaires
    private authService = inject(AuthService)
    private fb = inject(FormBuilder)
    private router = inject(Router)
    private uow = inject(UowService)

    // Déclaration du formulaire réactif
    myForm

    // Indicateur si les mots de passe ne correspondent pas
    isPwdInequal: boolean = false

    // Modèle utilisateur
    user: User = new User

    // Affichage ou non de l'alerte d'erreur ou de succès
    showAlert: boolean = false;

    // Objet contenant le type et le message de l'alerte
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };

    // Initialisation du formulaire avec les contrôles et leurs validations
    ngOnInit() {
        this.myForm = this.fb.group({
            id: 0,
            firstName: ['Soukaina', [Validators.required, Validators.minLength(3)]],
            lastName: ['Mourabit', [Validators.required, Validators.minLength(3)]],
            email: ['cirat67116@betzenn.com', [Validators.email, Validators.required]],
            password: ['Moura@gmail.com', Validators.required],
            confirmPassword: ['Moura@gmail.com', [Validators.required]],
            telephone: ['0625148599', [Validators.required, Validators.pattern(/^(06|07)\d{8}$/)]],
            roleId: 2,
        });
    }

    // Vérification que les mots de passe correspondent
    verify() {
        const user = this.myForm.getRawValue();
        console.log(user)
        user.password !== user.confirmPassword ? this.isPwdInequal = true : this.isPwdInequal = false
    }

    // Méthode d'inscription appelée lors de la soumission du formulaire
    signIn(): void {
        const { confirmPassword, ...user } = this.myForm.getRawValue();

        // Retour si le formulaire est invalide
        if (this.myForm.invalid) {
            return;
        }

        // Désactivation du formulaire pendant la requête
        this.myForm.disable();

        // Masquage de l'alerte avant traitement
        this.showAlert = false;

        // Appel du service d'inscription
        this.authService.register(user).subscribe((res) => {
            // Réactivation du formulaire après réponse
            this.myForm.enable();

            if (res.code === -2) {
                // Affichage d'une erreur générique renvoyée par le backend
                this.alert = {
                    type: 'error',
                    message: res.Message,
                };
                this.showAlert = true;
            }

            if (res.code === -1) {
                // Erreur spécifique : email déjà utilisé
                this.alert = {
                    type: 'error',
                    message: 'Email existe deja',
                };
                this.showAlert = true;
            }

            if (res.code === 1) {
                // Inscription réussie, vérification de l'envoi de mail
                if (res.isEmailSended != true) {
                    // Erreur lors de l'envoi du mail de vérification
                    this.alert = {
                        type: 'error',
                        message: "Erreur lors de l'envoi de l'e-mail de vérification. Veuillez réessayer plus tard.",
                    };
                    this.showAlert = true;
                } else {
                    // Enregistrement des données utilisateur et navigation vers la page de vérification email
                    localStorage.setItem('accessToken', res.token)
                    localStorage.setItem('userId', res.userId)
                    localStorage.setItem('userData', JSON.stringify(res.userData));
                    this.uow.users.currentUser$.next(res.userData)
                    this.router.navigateByUrl('verify/mail');
                }
            }
        })
    }
}
