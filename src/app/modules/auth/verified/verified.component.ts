import { CommonModule, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/services/auth.service';

@Component({
    selector: 'app-verified',
    standalone: true,
    imports: [CommonModule, NgIf],
    templateUrl: './verified.component.html',
    styleUrl: './verified.component.scss',
})
export class VerifiedComponent {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private authService = inject(AuthService);

    isVerified: boolean = false;
    token = this.route.snapshot.paramMap.get('token');

    ngOnInit(): void {
        let userId = parseInt(localStorage.getItem('userId'));
        if (userId != null) {
            this.authService.verifyRegistrationToken(userId, this.token).subscribe((response: { success: boolean }) => {
                if (response.success) {
                    this.isVerified = true;
                    this.authService.activeAccount(userId).subscribe((res) => {
                        // Wait 2 seconds and redirect to login
                        if (res.code === 1 ) {
                            setTimeout(() => {
                                this.router.navigate(['/sign-in']);
                            }, 2000);
                        } else {
                            // fuse poppups
                            console.log("Error of activating user account");

                        }

                    })

                } else {
                    console.log("Error of activating user account");
                    this.isVerified = false;

                }
            })

        }
        // const localToken = localStorage.getItem('token');


    }
}
