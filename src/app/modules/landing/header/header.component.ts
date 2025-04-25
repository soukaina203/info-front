import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Navigation, Router, RouterLink } from '@angular/router';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule,MatIcon,RouterLink],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
    isMenuOpen = false;
    isConnected: boolean = false
    isShowen: boolean = false
    navigation: Navigation;
    private router = inject(Router)


    ngOnInit() {
        // let user = localStorage.getItem("user");
        // user !== null ? this.isConnected = true : this.isConnected = false
        // console.log(user)
    }
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
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
