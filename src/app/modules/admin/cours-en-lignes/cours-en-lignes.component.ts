import { UowService } from './../../../services/uow.service';
import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject } from 'rxjs';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { User } from 'app/models/User';
import { RouterModule } from '@angular/router';
import { Role } from 'app/models/Role';
import { MatModule } from 'app/mat.module';
import { Component, inject, ViewChild } from '@angular/core';
import { FormGroup, FormsModule } from '@angular/forms';
import { NgxMatDatetimePickerModule } from '@angular-material-components/datetime-picker';
import { environment } from 'environment/environment';
import { format } from 'date-fns';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
    selector: 'app-reunion',
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatPaginatorModule,
        MatModule,
        MatMenuModule,
        MatDividerModule,
        NgApexchartsModule,
        MatTableModule,
        MatSortModule,
        RouterModule,
        FormsModule,
        MatProgressBarModule,
        DatePipe,
        NgxMatDatetimePickerModule,
        MatIconModule,
        NgClass


    ], templateUrl: './cours-en-lignes.component.html',
    styleUrls: ['./cours-en-lignes.component.scss']
})
export class CoursEnLignesComponent {
    @ViewChild('recentTransactionsTable', { read: MatSort }) recentTransactionsTableMatSort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    private uow = inject(UowService)
    private _unsubscribeAll = new Subject<any>();
    user: User = JSON.parse(localStorage.getItem("user"));
    paginatorEvent = new Subject<PageEvent>();
    list: User[] = [];
    isSearchBarOpened = false;
    data: any;
    environmentUrl = environment.url

    accountBalanceOptions: ApexOptions;
    recentTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    recentTransactionsTableColumns: string[] = ['id', 'titre', 'date', 'duree', 'prof'];
    myForm: FormGroup;
    roles: Role;
    // search

    title = '';
    prof = '';
    date: Date
    idRole = 0;
    isStudent: boolean
    environment = environment.url
        private sanitizer= inject( DomSanitizer)


    Url: SafeUrl

    openSearchBar() {
        this.isSearchBarOpened = !this.isSearchBarOpened;
        if (!this.isSearchBarOpened) this.ngOnInit();
    }

    delete(id: number) {
        this.uow.classes.delete(id).subscribe((response) => {
            response ? this.ngOnInit() : console.error("Error while deleting");
        });
    }

    getFormattedDate(dateString: string): string {
        const datePipe = new DatePipe('en-US');
        return datePipe.transform(dateString, 'yyyy-MM-dd', 'UTC') || '';
    }

    ngOnInit(): void {
        let user = JSON.parse(localStorage.getItem("userId"))

        this.uow.users.getOne(user).subscribe((res: any) => {
            this.user = res;

            if (this.user.roleId == 3 && !(this.recentTransactionsTableColumns.includes('actions'))) {
                this.recentTransactionsTableColumns.push('actions')
            }
            // this.user.role.name==="Etudiant"?this.isStudent=true : this.isStudent=false
        });

        this.uow.classes.getAll().subscribe((res: any) => {
            if (res.data !== null) {
                this.data = res.data;
                this.recentTransactionsDataSource.data = [...this.data].reverse();
                this.recentTransactionsDataSource.paginator = this.paginator;
                this.data.forEach(e => {
                    e.picture= this.sanitizer.bypassSecurityTrustUrl(`${this.environmentUrl}/classes/${e.picture}`)
                });
        // this.Url = this.sanitizer.bypassSecurityTrustUrl(`${this.environmentUrl}/classes/${this.image}`)

            }
            else {
                console.log(
                    "No data fetched"
                )
            }
        });


    }

    ngAfterViewInit(): void {
        this.recentTransactionsDataSource.sort = this.recentTransactionsTableMatSort;
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    submit() {
        console.log(this.date)
        const searchParams = {
            date: this.date ? format(this.date, 'yyyy-MM-dd') : null,
            title: this.title ? this.title : null,
            prof: this.prof ? this.prof : null
        };
        console.log(searchParams)

        this.uow.classes.search(searchParams).subscribe((res: any) => {
            this.data = res.list;
            this.recentTransactionsDataSource.data = [...this.data].reverse();
            this.recentTransactionsDataSource.paginator = this.paginator;
        });
    }

}
