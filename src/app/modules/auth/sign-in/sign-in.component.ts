import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {
    FormBuilder,
    FormsModule,
    NgForm,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseAlertComponent, FuseAlertType } from '@fuse/components/alert';
import { AuthService } from 'app/core/auth/auth.service';
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
export class AuthSignInComponent  {

    @ViewChild('signInNgForm') signInNgForm: NgForm;

    private fb = inject(FormBuilder)
    private uow = inject(UowService)
    private router = inject(Router)

    errorText: string = ""
    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };

    showAlert: boolean = false;

    myForm = this.fb.group({
        email: ["", [Validators.email, Validators.required]],
        password: ["", [Validators.required/*, Validators.minLength(6)*/]],

    });


    signIn(): void {
        const user = this.myForm.getRawValue();

        // Return if the form is invalid
        if (this.myForm.invalid) {
            return;
        }

        // Disable the form
        this.myForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this.uow.auth.login(user).subscribe((res) => {
            this.myForm.enable();
            if (res.code === -3) {
                this.alert = {
                    type: 'error',
                    message: 'Email non trouvé',
                };
                // Show the alert
                this.showAlert = true;
            }
               if (res.code === -4) { // sending email error
                this.alert = {
                    type: 'error',
                    message: res.message,
                };
                // Show the alert
                this.showAlert = true;
            }
            if (res.code === -1) {
                this.alert = {
                    type: 'error',
                    message: 'Mot de passe incorrect',
                };
                // Show the alert
                this.showAlert = true;

            }

            if (res.code===1 ) {
                localStorage.setItem('token', res.token)
                localStorage.setItem('userId', res.userId)
                localStorage.setItem('userData', res.userData)
                this.uow.users.currentUser$.next(res.userData)

                this.router.navigateByUrl('user');
            }


        })

    }
}
