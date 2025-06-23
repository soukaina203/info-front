import { Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { FuseValidators } from '@fuse/validators';
import { AuthService } from 'app/services/auth.service';
import { finalize } from 'rxjs';

@Component({
    selector: 'auth-reset-password',
    templateUrl: './reset-password.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        MatProgressSpinnerModule,
        RouterLink,
    ],
})
export class AuthResetPasswordComponent implements OnInit {
    // Référence au formulaire Angular
    @ViewChild('resetPasswordNgForm') resetPasswordNgForm: NgForm;

    // Objet pour gérer l'affichage des alertes (type + message)
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };

    // FormGroup réactif pour gérer le formulaire de réinitialisation
    resetPasswordForm: UntypedFormGroup;

    // Booléen pour afficher/cacher l'alerte
    showAlert: boolean = false;

    // Token extrait de l'URL pour valider la requête
    token: string;

    // Injection des services Angular nécessaires
    private route = inject(ActivatedRoute);
    private _authService = inject(AuthService);
    private _formBuilder = inject(UntypedFormBuilder);
    private router = inject(Router);

    /**
     * Méthode appelée au chargement du composant
     */
    ngOnInit(): void {
        // Création du formulaire avec validation : password et confirmation requises et doivent correspondre
        this.resetPasswordForm = this._formBuilder.group(
            {
                password: ['', Validators.required],
                passwordConfirm: ['', Validators.required],
            },
            {
                validators: FuseValidators.mustMatch(
                    'password',
                    'passwordConfirm'
                ),
            }
        );

        // Récupération du token depuis les paramètres de l'URL
        this.token = this.route.snapshot.paramMap.get('token');
    }

    /**
     * Méthode appelée lors de la soumission du formulaire pour réinitialiser le mot de passe
     */
    resetPassword(): void {
        // Ne rien faire si le formulaire est invalide
        if (this.resetPasswordForm.invalid) {
            return;
        }

        // Désactiver le formulaire pour empêcher plusieurs soumissions
        this.resetPasswordForm.disable();

        // Cacher toute alerte existante
        this.showAlert = false;

        // Appel du service pour réinitialiser le mot de passe avec le token et le nouveau mot de passe
        this._authService
            .resetPassword(this.token, this.resetPasswordForm.get('password').value)
            .pipe(
                finalize(() => {
                    // Réactiver le formulaire après la requête
                    this.resetPasswordForm.enable();

                    // Réinitialiser visuellement le formulaire
                    this.resetPasswordNgForm.resetForm();

                    // Afficher l'alerte avec le résultat
                    this.showAlert = true;
                })
            )
            .subscribe(
                response => {
                    // Si succès, afficher message et rediriger vers connexion
                    if (response.success) {
                        this.alert = {
                            type: 'success',
                            message: 'Votre mot de passe a été réinitialisé. Vous allez être redirigé vers la page de connexion...',
                        };

                        setTimeout(() => {
                            this.router.navigateByUrl('sign-in');
                        }, 1000); // délai 1 seconde avant redirection
                    }
                    // Sinon afficher message d'erreur générique
                    else {
                        this.alert = {
                            type: 'error',
                            message: "Une erreur s'est produite, veuillez réessayer.",
                        };
                    }
                }
            );
    }
}
