// Import des services et modules nécessaires
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
    selector: 'app-users', // Sélecteur du composant
    standalone: true, // Composant autonome (Angular 14+)
    imports: [ // Modules importés dans ce composant
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
    templateUrl: './users.component.html', // Template HTML associé
    styleUrls: ['./users.component.scss'], // Styles CSS associés
})
export class UsersComponent implements OnInit, AfterViewInit, OnDestroy {
    // Référence au tri de la table via ViewChild
    @ViewChild('recentTransactionsTable', { read: MatSort }) recentTransactionsTableMatSort: MatSort;
    // Référence au paginator (pagination)
    @ViewChild(MatPaginator) paginator: MatPaginator;

    // Injection du service unité de travail (UowService)
    private uow = inject(UowService)
    // Sujet pour gérer la désinscription des observables à la destruction du composant
    private _unsubscribeAll = new Subject<any>();

    // Récupération de l'utilisateur stocké dans le localStorage
    user: User = JSON.parse(localStorage.getItem("user"));
    // Sujet pour gérer les événements de pagination
    paginatorEvent = new Subject<PageEvent>();
    // Liste des utilisateurs
    list: User[] = [];
    // Indique si la barre de recherche est ouverte ou non
    isSearchBarOpened = false;
    // Données reçues
    data: any;
    // Options pour les graphiques ApexCharts
    accountBalanceOptions: ApexOptions;
    // Source de données pour la table des transactions récentes
    recentTransactionsDataSource: MatTableDataSource<any> = new MatTableDataSource();
    // Colonnes affichées dans la table
    recentTransactionsTableColumns: string[] = ['id', 'name', 'email', 'role', 'actions'];
    // Formulaire réactif
    myForm: FormGroup;
    // Liste des rôles disponibles
    roles: Role[];
    // Variables pour les champs du formulaire
    nom = '';
    prenom = '';
    email = '';
    idRole = 0;

    // Méthode pour ouvrir/fermer la barre de recherche
    openSearchBar() {
        this.isSearchBarOpened = !this.isSearchBarOpened;
        // Si la barre est fermée, on recharge la liste des utilisateurs
        if (!this.isSearchBarOpened) this.ngOnInit();
    }

    // Suppression d'un utilisateur par son id
    delete(id: number) {
        this.uow.users.delete(id).subscribe((response) => {
            // Si la suppression réussit, on recharge la liste
            response ? this.ngOnInit() : console.error("Error while deleting");
        });
    }

    // Sélection du rôle choisi
    choosenRole(id: number) {
        this.idRole = id;
    }

    // Méthode appelée au démarrage du composant
    ngOnInit(): void {
        // Définition des rôles disponibles
        this.roles = [{ id: 1, name: "Prof" }, { id: 2, name: "Étudiant" }, { id: 3, name: "Admin" }];

        // Récupération de tous les utilisateurs via le service
        this.uow.users.getAll().subscribe((res: any) => {
            this.data = res.data;
            // On inverse l'ordre des données pour afficher les plus récents en premier
            this.recentTransactionsDataSource.data = this.data.reverse();
            // Association du paginator à la table
            this.recentTransactionsDataSource.paginator = this.paginator;
        });
    }

    // Méthode appelée après l'initialisation de la vue
    ngAfterViewInit(): void {
        // Association du tri à la table
        this.recentTransactionsDataSource.sort = this.recentTransactionsTableMatSort;
    }

    // Méthode appelée lors de la destruction du composant
    ngOnDestroy(): void {
        // Nettoyage des abonnements
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // Soumission du formulaire de recherche
    submit() {
        // Si aucun critère saisi, on utilise un joker '*'
        const searchEmail = this.email || '*';
        const searchPrenom = this.prenom || '*';
        const searchNom = this.nom || '*';

        // Recherche des utilisateurs avec les critères fournis
        this.uow.users.searchUsers(searchNom, searchPrenom, searchEmail, this.idRole).subscribe((res: any) => {
            // Mise à jour des données affichées dans la table
            this.recentTransactionsDataSource.data = res.query.result;
        });
    }
}
