# Projet 7 - Groupomania
__Créez un réseau social d’entreprise__

ReactJS - Next.JS - AdonisJS - PostgreSQL

## Contexte

Développer un réseau social pour les employés de Groupomania.
L'objectif de ce réseau est d'améliorer et facilité l'intéraction entre collègues.
Plusieurs fonctionnalités doivent contribuer à cet objectif.

## Base de données

PostgreSQL est installée sur un serveur dédié.

Pour qu'AdonisJS fonctionne, un fichier .env, envoyé dans les livrables doit être ajouté à la racine du serveur AdonisJS.
## Architecture

#### Côté serveur -> /

- /app -> Logique de l'application (Controllers, Middlewares, Models...)
- /commands -> Contient les commandes CLI
- /config -> La configuration d'exécution de votre application et des packages installée
- /contracts -> Déclaration des interfaces des packages
- /database -> Migrations des tables et gestion des factories
- /providers -> Fournisseurs de service s'exécutant pendant le cycle de vie de l'application
- /start -> Déclaration des routes et des middlewares
- /tests -> Fichiers de tests unitaires

#### Côté client -> /client

- /lib -> Scripts s'exécutant en dehors de l'application
- /public -> Contient les medias (img, svg...)
- /src
    - /actions -> Fonctions permettant de créer des actions à la base de données
    - /assets -> Fichiers scss de l'application
    - /components
        - /admin -> Composants visibles pour les administrateurs
        - /core -> Composants globaux
        - /guest -> Composants visibles pour les visiteurs
        - /layouts -> Layouts des pages NextJS
        - /users -> Composants visibles pour les utilisateurs connectés
    - /config -> Dossier de configurations
    - /contexts -> Dossier contenant les contextes
    - /events -> Événements de socket.io
    - /helpers -> Fonctions globales
    - /hooks -> Crochets personnalisés
    - /pages -> Chaque page est un composant React et est associé à une route selon son nom de fichier
    - /reducers -> Définition de states et ses différentes mutations
    - /services -> Service de connexion à socket.io et de requêtes fetch
    - /types -> Déclarations d'interfaces
    - /validators -> Validations des formulaires

## Installation

#### À la racine du projet

```bash
  yarn install
```

Lancement du build pour la production :

```bash
  yarn build
```

Lancement du serveur :

```bash
  yarn start
```

#### À la racine du dossier /client

Répéter les commandes ci-dessus

Rendez-vous sur http://127.0.0.1:3000/
