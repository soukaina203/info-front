import { BooleanInput } from '@angular/cdk/coercion';
import { CommonModule, NgClass } from '@angular/common';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    inject,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { Router, RouterLink } from '@angular/router';
import { UserService } from 'app/core/user/user.service';
import { User } from 'app/models/User';
import { environment } from 'environment/environment';
import { Subject, takeUntil } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AuthService } from 'app/services/auth.service';

@Component({
    selector: 'user',
    templateUrl: './user.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush,
    exportAs: 'user',
    standalone: true,
    imports: [
        MatButtonModule,
        MatMenuModule,
        MatIconModule,
        NgClass,
        RouterLink,
        MatDividerModule,
        CommonModule,
    ],
})
export class UserComponent implements OnInit, OnDestroy {
    /* eslint-disable @typescript-eslint/naming-convention */
    static ngAcceptInputType_showAvatar: BooleanInput;
    /* eslint-enable @typescript-eslint/naming-convention */

    @Input() showAvatar: boolean = true;
    user: User;
    url = environment.url
    Url: SafeUrl

    private router = inject(Router)
    private sanitizer = inject(DomSanitizer)
    private authService = inject(AuthService)

    private _unsubscribeAll: Subject<any> = new Subject<any>();



    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void {
        // Subscribe to user changes
        this.user = JSON.parse(localStorage.getItem("userData"));
        console.log(this.user)
        if (this.user!=null) {

            this.Url = this.sanitizer.bypassSecurityTrustUrl(`${this.url}/photos/${this.user.photo}`)
        }

        // this._userService.user$
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe((user: User) => {
        //         this.user = user;

        //         // Mark for check
        //         this._changeDetectorRef.markForCheck();
        //     });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Update the user status
     *
     * @param status
     */

    /**
     * Sign out
     */
    signOut(): void {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.authService._authenticated=false;

        this.router.navigate(['/']);
    }
}
