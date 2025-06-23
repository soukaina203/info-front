import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { IResetPassword } from 'app/interfaces/IResetPassword';
import { AuthService } from 'app/services/auth.service';
import { parseJSON } from 'date-fns';
import { finalize } from 'rxjs';

@Component({
    selector: 'auth-forgot-password',
    templateUrl: './forgot-password.component.html',
    encapsulation: ViewEncapsulation.None, // Pas d'encapsulation des styles
    animations: fuseAnimations, // Animations fournies par Fuse
    standalone: true, // Composant autonome
    imports: [
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        RouterLink,
    ],
})
export class AuthForgotPasswordComponent implements OnInit {
    @ViewChild('forgotPasswordNgForm') forgotPasswordNgForm: NgForm; // Référence au formulaire template-driven

    // Objet d'alerte pour afficher des messages à l'utilisateur
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    forgotPasswordForm: UntypedFormGroup; // Formulaire réactif pour la récupération du mot de passe
    showAlert: boolean = false; // Indique si l'alerte est visible
    user: IResetPassword;

    constructor(
        private _authService: AuthService, // Service d'authentification pour les requêtes API
        private _formBuilder: UntypedFormBuilder // Création de formulaires réactifs
    ) { }

    ngOnInit(): void {
        // Initialisation du formulaire avec validation sur l'email (obligatoire + format)
        this.forgotPasswordForm = this._formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
        });
    }

    sendResetLink(): void {
        // Ne rien faire si le formulaire est invalide
        if (this.forgotPasswordForm.invalid) {
            return;
        }

        // Désactivation du formulaire pour éviter les doubles soumissions
        this.forgotPasswordForm.disable();

        // Cacher l'alerte avant la requête
        this.showAlert = false;

        // Récupération de l'email saisi
        const email = this.forgotPasswordForm.value.email;

        // Appel du service pour envoyer le lien de réinitialisation
        this._authService.forgotPassword(email)
            .pipe(
                finalize(() => {
                    // Réactivation du formulaire après la réponse
                    this.forgotPasswordForm.enable();

                    // Réinitialisation du formulaire template-driven
                    this.forgotPasswordNgForm.resetForm();

                    // Affichage de l'alerte
                    this.showAlert = true;
                })
            )
            .subscribe(
                response => {
                    // Gestion des différents codes retour de l'API
                    if (response.code === 200) {
                        this.alert = {
                            type: 'success',
                            message:
                                "Réinitialisation du mot de passe envoyée ! Vous recevrez un e-mail si vous êtes inscrit(e) dans notre système",
                        };
                    }
                    if (response.code === 404) {
                        this.alert = {
                            type: 'warn',
                            message:
                                "Adresse e-mail introuvable ! Êtes-vous sûr(e) d'être déjà inscrit(e) ?",
                        };
                    }
                    if (response.code === 500) {
                        this.alert = {
                            type: 'error',
                            message:
                                "Une erreur est survenue, merci de réessayer plus tard"
                        };
                    }
                }
            );
    }
}
