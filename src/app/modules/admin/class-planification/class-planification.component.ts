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

@Component({
  selector: 'app-class-planification',
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
        MatIconModule
  ],
  templateUrl: './class-planification.component.html',
  styleUrl: './class-planification.component.scss'
})
export class ClassPlanificationComponent {
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
    recentTransactionsTableColumns: string[] = [];
    myForm: FormGroup;
    roles: Role;
    nom = '';
    prenom = '';
    email = '';
    idRole = 0;
    isStudent: boolean
    environment = environment.url


    openSearchBar() {
        this.isSearchBarOpened = !this.isSearchBarOpened;
        if (!this.isSearchBarOpened) this.ngOnInit();
    }

    delete(id: number) {
        this.uow.classes.delete(id).subscribe((response) => {
            response ? this.ngOnInit() : console.error("Error while deleting");
        });
    }



    ngOnInit(): void {
        let user = JSON.parse(localStorage.getItem("user"))

        if (user.role.name === "Prof") {
            this.recentTransactionsTableColumns = ['id', 'titre', 'date', 'duree', 'actions']
        }
        if (user.isAdmin) {
            this.recentTransactionsTableColumns = ['id', 'titre', 'date', 'duree', 'prof', 'actions']

        }
        if (user.role.name = "Prof") {
            this.uow.classes.getClassesByProfId(user.id).subscribe((data: any) => {
                if (data.list !== null) {
                    this.data = data.list;
                    this.recentTransactionsDataSource.data = [...this.data].reverse();
                    this.recentTransactionsDataSource.paginator = this.paginator;
                }
                else {
                    console.log(
                        "No data fetched"
                    )
                }
            }
            );
        } else {
            this.uow.classes.getAll().subscribe((data: any) => {
                this.recentTransactionsTableColumns = ['id', 'titre', 'date', 'duree', 'prof', 'actions'];
                if (data.list !== null) {
                    this.data = data.list;
                    this.recentTransactionsDataSource.data = [...this.data].reverse();
                    this.recentTransactionsDataSource.paginator = this.paginator;
                }
                else {
                    console.log(
                        "No data fetched"
                    )
                }
            });
        }






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

    }
}
