// Importation des services, modules Angular, composants Material, et modèles nécessaires
import { UowService } from './../../../services/uow.service';
import { CommonModule, CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIcon, MatIconModule } from '@angular/material/icon';
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
import { IResponse } from 'app/interfaces/IResponse';

@Component({
    selector: 'app-class-planification', // Sélecteur HTML du composant
    standalone: true, // Composant autonome Angular
    imports: [ // Modules Angular et tiers utilisés dans ce composant
        CommonModule,
        MatButtonModule,
        MatIconModule,
        MatPaginatorModule,
        MatIcon,
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
        MatModule
    ],
    templateUrl: './class-planification.component.html', // Template HTML du composant
    styleUrl: './class-planification.component.scss' // Fichier de styles associé
})
export class ClassPlanificationComponent {
    // Références aux éléments de tri et de pagination dans le DOM
    @ViewChild('recentTransactionsTable', { read: MatSort }) recentTransactionsTableMatSort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    // Injection du service de gestion des données
    private uow = inject(UowService)
    private _unsubscribeAll = new Subject<any>(); // Permet de gérer les désabonnements RxJS

    // Déclarations des propriétés du composant
    user: User = JSON.parse(localStorage.getItem("userData")) // Récupération de l'utilisateur connecté
    paginatorEvent = new Subject<PageEvent>(); // Pour écouter les événements de pagination
    list: User[] = [];
    isSearchBarOpened = false;
    data: any;
    currentRole: string;
    accountBalanceOptions: ApexOptions;
    recentTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource(); // Source de données pour le tableau
    recentTransactionsTableColumns: string[] = []; // Colonnes du tableau
    myForm: FormGroup;
    roles: Role;
    nom = '';
    prenom = '';
    email = '';
    idRole = 0;
    isStudent: boolean;
    environment = environment.url; // URL de l’environnement (ex: API)

    // Ouvre/ferme la barre de recherche, recharge les données si fermée
    openSearchBar() {
        this.isSearchBarOpened = !this.isSearchBarOpened;
        if (!this.isSearchBarOpened) this.ngOnInit();
    }

    // Supprime une classe en fonction de son ID
    delete(id: number) {
        this.uow.classes.delete(id).subscribe((response) => {
            response ? this.ngOnInit() : console.error("Error while deleting");
        });
    }

    // Initialisation du composant : récupération des rôles et chargement des données selon le rôle
    ngOnInit(): void {
        this.uow.role.getOne(this.user.roleId).subscribe((res: Role) => {
            this.currentRole = res.name

            // Cas pour les professeurs
            if (this.currentRole == "Prof") {
                this.recentTransactionsTableColumns = ['id', 'titre', 'date', 'duree', 'actions'];
                this.uow.classes.getClassesByProfId(this.user.id).subscribe((res: IResponse) => {
                    if (res.data !== null) {
                        this.data = res.data;
                        this.recentTransactionsDataSource.data = [...this.data].reverse();
                        this.recentTransactionsDataSource.paginator = this.paginator;
                    } else {
                        console.log("No data fetched");
                    }
                });
            }

            // Cas pour les administrateurs
            if (this.currentRole == "Admin") {
                this.recentTransactionsTableColumns = ['id', 'titre', 'date', 'duree', 'prof', 'actions'];
                this.uow.classes.getAll().subscribe((res: any) => {
                    if (res.data !== null) {
                        this.data = res.data;
                        this.recentTransactionsDataSource.data = [...this.data].reverse();
                        this.recentTransactionsDataSource.paginator = this.paginator;
                    } else {
                        console.log("No data fetched");
                    }
                });
            }
        });
    }

    // Lancement du tri du tableau après affichage
    ngAfterViewInit(): void {
        this.recentTransactionsDataSource.sort = this.recentTransactionsTableMatSort;
    }

    // Nettoyage lors de la destruction du composant
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // Méthode de recherche (non encore implémentée)
    submit() {
        const searchEmail = this.email || '*';
        const searchPrenom = this.prenom || '*';
        const searchNom = this.nom || '*';


    }
}
