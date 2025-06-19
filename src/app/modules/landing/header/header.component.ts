import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Navigation, Router, RouterLink } from '@angular/router';
import { User } from 'app/models/User';
import { AuthService } from 'app/services/auth.service';
import { environment } from 'environment/environment';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, MatIcon, RouterLink],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    isMenuOpen = false;
    isConnected: boolean = false
    isShowen: boolean = false
    navigation: Navigation;
    user: User;
    Url: SafeUrl;
    url = environment.url

    private sanitizer = inject(DomSanitizer)
    private router = inject(Router)
    private authService = inject(AuthService)


    ngOnInit() {
        // let user = localStorage.getItem("user");
        // user !== null ? this.isConnected = true : this.isConnected = false
        // console.log(user)
        this.authService._authenticated ? this.isConnected = true : this.isConnected = false;
        this.user = JSON.parse(localStorage.getItem("userData"));
        console.log(this.user)
        if (this.user != null) {

            this.Url = this.sanitizer.bypassSecurityTrustUrl(`${this.url}/photos/${this.user.photo}`)
        }

    }
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.authService._authenticated=false;
        this.router.navigate(['/']);
    }
    profileOptions() {
        event.stopPropagation();
        this.isShowen = !this.isShowen;

    }
    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }

}
