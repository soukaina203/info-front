import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormBuilder,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { UowService } from 'app/services/uow.service';

@Component({
    selector: 'auth-sign-in',
    templateUrl: './sign-in.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    standalone: true,
    imports: [
        RouterLink,
        FuseAlertComponent,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatIconModule,
        CommonModule,
        MatCheckboxModule,
        MatProgressSpinnerModule,
    ],
})
export class AuthSignInComponent {

    // Accès au formulaire dans le template
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    // Injection des services et utilitaires Angular
    private fb = inject(FormBuilder);
    private uow = inject(UowService);
    private router = inject(Router);

    // Variables pour gérer l’affichage des alertes
    errorText: string = "";
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };
    showAlert: boolean = false;

    // Définition du formulaire réactif avec validation
    myForm = this.fb.group({
        email: ["", [Validators.email, Validators.required]],   // Email obligatoire et format valide
        password: ["", [Validators.required]],                   // Mot de passe obligatoire
    });

    // Méthode appelée à la soumission du formulaire
    signIn(): void {
        const user = this.myForm.getRawValue();

        // Si le formulaire est invalide, on arrête la fonction
        if (this.myForm.invalid) {
            return;
        }

        // Désactivation du formulaire pendant la requête
        this.myForm.disable();

        // Cacher toute alerte avant la requête
        this.showAlert = false;

        // Appel au service de connexion (login)
        this.uow.auth.login(user).subscribe((res) => {
            // Réactivation du formulaire après réponse
            this.myForm.enable();

            // Gestion des différentes réponses du serveur selon le code retourné

            if (res.code === -3) {
                // Email non trouvé dans la base
                this.alert = {
                    type: 'error',
                    message: 'Email non trouvé',
                };
                this.showAlert = true;
            }

            if (res.code === -4) {
                // Erreur lors de l'envoi d'email (ex: problème serveur)
                this.alert = {
                    type: 'error',
                    message: res.message,
                };
                this.showAlert = true;
            }

            if (res.code === -1) {
                // Mot de passe incorrect
                this.alert = {
                    type: 'error',
                    message: 'Mot de passe incorrect',
                };
                this.showAlert = true;
            }

            if (res.code === 1) {
                // Connexion réussie
                this.uow.auth._authenticated = true;

                // Sauvegarde du token d'accès dans le service
                this.uow.auth.setAccessToken(res.token);

                // Sauvegarde des données utilisateur dans localStorage
                localStorage.setItem('userId', res.userId);
                localStorage.setItem('userData', JSON.stringify(res.userData));

                // Mise à jour de l'utilisateur courant dans le service utilisateur
                this.uow.users.currentUser$.next(res.userData);

                // Redirection vers le tableau de bord utilisateur
                this.router.navigateByUrl('user/dashboard');
            }
        });
    }
}
