# 📌 Titre & Description

**Nom du projet** : Info‑Académie – Frontend

**Description** :  
Application web développée avec **Angular**, permettant aux étudiants de choisir leurs professeurs, et aux enseignants de proposer leurs services. Le projet se concentre actuellement sur le **soutien scolaire** et l’**apprentissage des langues**.

---

## ✅ Prérequis

- **Node.js** : nécessaire pour exécuter Angular et gérer les dépendances. Télécharger la version LTS sur [nodejs.org](https://nodejs.org/).
- **npm** : installé automatiquement avec Node.js.
- **Angular CLI** : interface en ligne de commande pour gérer le projet Angular  
  ➤ `npm install -g @angular/cli`
- **Git** : pour cloner le code source depuis le dépôt distant.

---

## ⚙️ Configuration

Cloner le projet :

bash
git clone https://github.com/soukaina203/info-front.git
cd info-front
Configurer l’URL de l’API backend :
Modifier le fichier src/environments/environment.ts :
const URL_DEV = `http://localhost:5107`;

export const environment = {
  production: false,
  apiUrl: `${URL_DEV}/api`,
  url: `${URL_DEV}`,
  mobile: false
};

Installer les dépendances :
npm install
## 🚀 Lancement
Pour démarrer l’application en local :
ng serve

L’application sera accessible sur :
📍 http://localhost:4200

## 🧩 Fonctionnalités principales
- ** Inscription et connexion des professeurs et des étudiants **

 **Mot de passe oublié et réinitialisation**

 **Tableau de bord personnalisé**

 **Gestion des utilisateurs**

 **Gestion des classes virtuelles**

 **Dépôt et gestion de CV**

 **Gestion de profils utilisateurs**

 **Landing page et page de présentation des services**

## 🗂️ Structure du projet
L'application suit l'architecture MVVM et utilise le Fuse Theme pour la structure et l’interface. Voici les principaux dossiers :

 **/public** : Fichiers statiques (images, polices, icônes, traductions, etc.).

 **/src/** : Contient tout le code source de l’application.

 **@fuse/** : Composants et services du thème Fuse (ne pas modifier).

 **app/** : les composants d'application 

 **core/** : Services globaux, gardes, configurations, validateurs.

 **layout/**: Mise en page générale, menus, notifications, etc.

 **mock-api/** : Données fictives pour les tests.

 **services/** : Gestion de la logique métier et appels API.

 **utils/** : Fonctions utilitaires partagées.

 **modules/** : Modules fonctionnels regroupés par domaine :

 **auth/** : Authentification (connexion, inscription…)

 **landing/** : Composants de la page d’accueil

 **admin/** : Composants du tableau de bord

 **shared/**: Composants réutilisables (modales, popups, etc.)

 **/src/styles/** : Fichiers SCSS globaux, Tailwind et styles des bibliothèques externes.

## 🛠️ Choix technologiques
Angular : Framework SPA basé sur TypeScript

Tailwind CSS + Fuse Theme : UI moderne, réactive et personnalisable

.NET Web API : Backend pour la gestion des données

Utilisation de :

Formulaires réactifs

Intercepteurs HTTP

Routing modulaire

Services REST

Gestion centralisée des états
