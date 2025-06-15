# 📌 Info‑Académie – Frontend

**Application web développée avec Angular**, permettant aux étudiants de choisir leurs professeurs, et aux enseignants de proposer leurs services.  
Le projet se concentre actuellement sur **le soutien scolaire et l’apprentissage des langues**.

---

## ✅ Prérequis

- **Node.js** : nécessaire pour exécuter Angular et gérer les dépendances. Télécharger la version LTS sur [nodejs.org](https://nodejs.org/).
- **npm** : installé automatiquement avec Node.js.
- **Angular CLI** : interface en ligne de commande pour gérer le projet Angular  
  👉 `npm install -g @angular/cli`
- **Git** : pour cloner le code source depuis le dépôt distant.

---

## ⚙️ Configuration

### Cloner le projet :

bash

git clone https://github.com/soukaina203/info-front.git
cd info-front
Configurer l’URL de l’API backend :
Modifier le fichier src/environments/environment.ts :

ts
Copier
Modifier
const URL_DEV = `http://localhost:5107`;

export const environment = {
  production: false,
  apiUrl: `${URL_DEV}/api`,
  url: `${URL_DEV}`,
  mobile: false
};
Installer les dépendances :
bash
Copier
Modifier
npm install
🚀 Lancement
Pour démarrer l’application en local :

bash
Copier
Modifier
ng serve
L’application sera accessible sur 👉 http://localhost:4200

🧩 Fonctionnalités principales
✅ Inscription et connexion des professeurs et des étudiants

🔐 Mot de passe oublié et réinitialisation

🧑‍🏫 Tableau de bord personnalisé

👥 Gestion des utilisateurs

💻 Gestion des classes virtuelles

📄 Dépôt et gestion de CV

🔧 Gestion de profils utilisateurs

🏠 Landing page et page de présentation des services

🗂️ Structure du projet
L'application suit l'architecture MVVM et utilise le Fuse Theme pour la structure et l’interface.

bash
Copier
Modifier
/public       → Fichiers statiques (images, polices, traductions, etc.)
/src/         → Code source de l’application
  └── @fuse/        → Composants et services du thème Fuse (à ne pas modifier)
  └── app/
        └── core/        → Services globaux, gardes, validateurs, config
        └── layout/      → Mise en page (menus, notifications, etc.)
        └── mock-api/    → Données fictives pour les tests
        └── services/    → Logique métier et appels API
        └── utils/       → Fonctions utilitaires
        └── modules/
              └── auth/     → Connexion, inscription, etc.
              └── landing/  → Page d’accueil
              └── admin/    → Tableau de bord (dashboard)
              └── shared/   → Composants réutilisables
        └── styles/      → Fichiers SCSS, Tailwind, styles externes
🛠️ Choix technologiques
Technologie	Rôle
Angular	Framework SPA structuré basé sur TypeScript
Tailwind CSS + Fuse	UI moderne, rapide à construire et responsive
.NET Web API	Backend sécurisé pour la gestion des données
Formulaires réactifs	Gestion avancée des formulaires
Intercepteurs HTTP	Gestion automatique des tokens, erreurs, etc.
Routing modulaire	Organisation claire des pages et modules
