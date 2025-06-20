import { UowService } from './../../../services/uow.service';
import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ApexOptions, NgApexchartsModule } from 'ng-apexcharts';
import { Subject, takeUntil } from 'rxjs';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { User } from 'app/models/User';
import { RouterModule } from '@angular/router';
import { UserService } from 'app/services/user.service';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { Role } from 'app/models/Role';
import { MatModule } from 'app/mat.module';

@Component({
    selector: 'app-users',
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
        NgClass,
        RouterModule,
        FormsModule,
        MatProgressBarModule,
        CurrencyPipe,
        DatePipe,
    ],
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
    @ViewChild('recentTransactionsTable', { read: MatSort }) recentTransactionsTableMatSort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    private uow = inject(UowService)
    private _unsubscribeAll = new Subject<any>();

    user: User = JSON.parse(localStorage.getItem("user"));
    paginatorEvent = new Subject<PageEvent>();
    list: User[] = [];
    isSearchBarOpened = false;
    data: any;
    accountBalanceOptions: ApexOptions;
    recentTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    recentTransactionsTableColumns: string[] = ['id', 'name', 'email', 'role', 'actions'];
    myForm: FormGroup;
    roles: Role[];
    nom = '';
    prenom = '';
    email = '';
    idRole = 0;


    openSearchBar() {
        this.isSearchBarOpened = !this.isSearchBarOpened;
        if (!this.isSearchBarOpened) this.ngOnInit();
    }

    delete(id: number) {
        this.uow.users.delete(id).subscribe((response) => {
            response ? this.ngOnInit() : console.error("Error while deleting");
        });
    }

    choosenRole(id: number) {
        this.idRole = id;
    }

    ngOnInit(): void {
        this.roles = [{ id: 1, name: "Prof" }, { id: 2, name: "Étudiant" }, { id: 3, name: "Admin" }];
        // this.uow.users.getOne(this.user.id).subscribe((res) => {
        //   this.user = res;

        //     if (this.user.isAdmin && !(this.recentTransactionsTableColumns.includes('actions'))) {
        //         this.recentTransactionsTableColumns.push('actions')
        //     }
        // });

        this.uow.users.getAll().subscribe((res: any) => {
            console.log("========")
            console.log(res)
            this.data = res.data;
            this.recentTransactionsDataSource.data = this.data.reverse();
            this.recentTransactionsDataSource.paginator = this.paginator;
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
        const searchEmail = this.email || '*';
        const searchPrenom = this.prenom || '*';
        const searchNom = this.nom || '*';

        this.uow.users.searchUsers(searchNom, searchPrenom, searchEmail, this.idRole).subscribe((res: any) => {
            this.recentTransactionsDataSource.data = res.query.result;
        });
    }
}
