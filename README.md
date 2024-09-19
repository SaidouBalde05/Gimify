# Gimify
Ce projet est un site de vente de musique en ligne, permettant aux utilisateurs d'acheter et d'écouter de la musique directement depuis l'application. Le site est conçu pour être utilisé par deux types de rôles principaux : les administrateurs et les utilisateurs réguliers.

## Fonctionnalités Principales

1. **Authentification et Autorisation**
   - **Inscription et Connexion** : Les utilisateurs peuvent créer un compte ou se connecter avec des identifiants.
   - **Rôles Utilisateurs** :
     - **Admin** : Accède à un tableau de bord complet, publie de la musique, crée des comptes administrateur, et consulte les statistiques du site.
     - **Utilisateur** : Peut acheter et écouter de la musique, consulter son propre tableau de bord pour voir ses achats.

2. **Tableau de Bord**
   - **AdminDashboardComponent** : Affiche la liste des utilisateurs et des ventes. Permet à l'administrateur de surveiller l'activité du site.
   - **UserDashboardComponent** : Affiche les informations personnelles de l'utilisateur et les fichiers qu'il a acheter.

3. **Publication de Musique**
   - **Admin** : Peut publier de nouveaux albums en fournissant un nom, une image, des fichiers audio, et un prix. Les albums sont visibles dans la liste des musiques.
   - **Écoute en Ligne** : Les utilisateurs peuvent écouter leur albums acheter que via l'application pour eviter le transfert .

4. **Achats et Réinitialisation de Mot de Passe**
   - **Achats** : Lorsqu'un utilisateur achète un album, l'achat est enregistré et stocké dans une base de données. Les informations d'achat sont visibles uniquement pour les administrateurs et l'utilisateur concerné.

5. **Gestion des Erreurs et Messages**
   - **Erreurs de Connexion** : Messages d'erreur affichés lorsque les identifiants sont incorrects ou lors de problèmes de connexion.

## Composants Clés

1. **LoginComponent** : Gère la connexion des utilisateurs et la réinitialisation du mot de passe. Permet de basculer entre le mode connexion et le mode réinitialisation du mot de passe.
2. **MusicListComponent** : Affiche la liste des albums disponibles. Les utilisateurs peuvent voir les détails des albums et écouter des extraits.
3. **MusicDetailComponent** : Affiche les détails d'un album spécifique, y compris les boutons pour acheter et écouter de la musique. Le contenu audio complet est accessible uniquement après l'achat.
4. **AdminDashboardComponent** : Permet à l'administrateur de consulter les utilisateurs et les ventes. Affiche des statistiques spécifiques du site.
5. **UserDashboardComponent** : Affiche les informations de l'utilisateur connecté et les albums qu'il a achetés.

## Architecture et Technologies

- **Angular** : Framework utilisé pour le développement de l'application web.
- **TailwindCSS** : Utilisé pour le stylisme de l'application, offrant une interface utilisateur moderne et responsive.
- **JSON Server** : Utilisé pour le stockage temporaire des données des utilisateurs, des publications, et des ventes.

## Sécurité et Conformité

- **Authentification Sécurisée** : Les mots de passe sont gérés de manière sécurisée et les utilisateurs sont authentifiés avant d'accéder aux fonctionnalités restreintes.
- **Protection des Contenus** : Les fichiers audio achetés ne peuvent être écoutés qu'à l'intérieur de l'application pour éviter le transfert illégal des fichiers.

## Futur Développement

- **Application Mobile** : Intégration future des fonctionnalités du site dans une application mobile pour Android et iOS.
- **Améliorations des Statistiques** : Ajout de nouvelles fonctionnalités pour les statistiques du site, y compris les revenus détaillés et les performances des ventes.






























This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.3.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
