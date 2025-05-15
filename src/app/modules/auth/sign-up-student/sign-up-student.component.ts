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
    @ViewChild('signInNgForm') signInNgForm: NgForm;

    private authService = inject(AuthService)
    private fb = inject(FormBuilder)
    private router = inject(Router)
    myForm
    isPwdInequal: boolean = false
    user: User = new User
    showAlert: boolean = false;

    alert: { type: FuseAlertType; message: string } = {
        type: 'success',
        message: '',
    };


    ngOnInit() {

        this.myForm = this.fb.group({
            id: 0,
            firstName: ['Soukaina', [Validators.required, Validators.minLength(3)]],
            lastName: ['Mourabit', [Validators.required, Validators.minLength(3)]],
            email: ['motoso5004@daupload.com', [Validators.email, Validators.required]],
            password: ['Moura@gmail.com', Validators.required],
            confirmPassword: ['Moura@gmail.com', [Validators.required]],
            telephone: ['0625148599', [Validators.required, Validators.pattern(/^(06|07)\d{8}$/)]],
            roleId: 2,
            isAdmin: false,


        });
    }
    verify() {
        const user = this.myForm.getRawValue();
        console.log(user)
        user.password !== user.confirmPassword ? this.isPwdInequal = true : this.isPwdInequal = false

    }

    signIn(): void {
        const { confirmPassword, ...user } = this.myForm.getRawValue();

        // const user = this.myForm.getRawValue() as User;
        console.log(user)
        // Return if the form is invalid
        if (this.myForm.invalid) {
            return;
        }

        // Disable the form
        this.myForm.disable();

        // Hide the alert
        this.showAlert = false;

        // Sign in
        this.authService.register(user).subscribe((res) => {
            this.myForm.enable();
            console.log("===============")
            console.log(res)
            if (res.code === -2) {
                this.alert = {
                    type: 'error',
                    message: res.Message,
                };
                // Show the alert
                this.showAlert = true;
            }

            if (res.code === -1) {
                this.alert = {
                    type: 'error',
                    message: 'Email existe deja',
                };
                // Show the alert
                this.showAlert = true;
            }

            if (res.code === 1) {

                if (res.isEmailSended != true) {

                    this.alert = {
                        type: 'error',
                        message: "Erreur lors de l'envoi de l'e-mail de vérification. Veuillez réessayer plus tard.",
                    };
                }else{

                    localStorage.setItem('token',res.token)
                    localStorage.setItem('userId',res.userId)
                    this.router.navigateByUrl('verify/mail');

                }

        }

        })
    }
}
