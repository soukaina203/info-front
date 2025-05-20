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
    const localToken = localStorage.getItem('token');

    if (localToken === this.token) {
      this.isVerified = true;
        let userId=localStorage.getItem('userId');
        this.authService.activeAccount(userId).subscribe((res)=>{
            // Wait 2 seconds and redirect to login
            if (res.code===1 && localStorage.getItem('token')!=null) {
                setTimeout(() => {
                  this.router.navigate(['/user']);
                }, 2000);
            }else{
                // fuse poppups
                console.log("Error of activating user account");

            }

        })
    }
  }
}
