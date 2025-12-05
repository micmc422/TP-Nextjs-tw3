# @workspace/database

Package de base de données MongoDB pour le projet TP-Nextjs.

## Description

Ce package fournit un client MongoDB et des modèles pour gérer les données de l'application. Il est conçu pour introduire les concepts de base de données et préparer l'implémentation de l'authentification web.

## Prérequis

- Docker et Docker Compose installés
- Node.js 20+
- pnpm

## Démarrage rapide

### 1. Lancer MongoDB avec Docker

Depuis la racine du projet :

```bash
docker compose up -d
```

Cela démarre une instance MongoDB accessible sur `mongodb://localhost:27017`.

### 2. Vérifier que MongoDB est en cours d'exécution

```bash
docker compose ps
```

### 3. Utiliser le package dans votre code

```typescript
import { 
  getDatabase, 
  checkConnection,
  createUser,
  findUserByEmail,
  initializeUsersCollection 
} from '@workspace/database';

// Vérifier la connexion
const isConnected = await checkConnection();
console.log('MongoDB connecté:', isConnected);

// Initialiser les index (à faire une fois au démarrage)
await initializeUsersCollection();

// Créer un utilisateur
const user = await createUser({
  email: 'test@example.com',
  name: 'Test User',
  password: 'hashed_password', // À hasher avec bcrypt en production
});

// Trouver un utilisateur par email
const foundUser = await findUserByEmail('test@example.com');
```

## Configuration

Le package utilise des variables d'environnement pour la configuration :

| Variable | Description | Défaut |
|----------|-------------|--------|
| `MONGODB_URI` | URL de connexion MongoDB | `mongodb://localhost:27017` |
| `MONGODB_DB_NAME` | Nom de la base de données | `tp-nextjs` |

### Exemple de fichier `.env.local`

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB_NAME=tp-nextjs
```

## Commandes Docker utiles

```bash
# Démarrer MongoDB
docker compose up -d

# Arrêter MongoDB
docker compose down

# Voir les logs
docker compose logs -f mongodb

# Accéder au shell MongoDB
docker exec -it tp-nextjs-mongodb mongosh
```

## API

### Client MongoDB

- `getMongoClient()` - Récupère le client MongoDB
- `getDatabase()` - Récupère la base de données principale
- `getCollection<T>(name)` - Récupère une collection typée
- `closeConnection()` - Ferme la connexion
- `checkConnection()` - Vérifie la connexion

### Modèle User

- `createUser(input)` - Crée un utilisateur
- `findUserById(id)` - Trouve un utilisateur par ID
- `findUserByEmail(email)` - Trouve un utilisateur par email
- `listUsers(limit, skip)` - Liste les utilisateurs avec pagination
- `updateUser(id, input)` - Met à jour un utilisateur
- `deleteUser(id)` - Supprime un utilisateur
- `countUsers()` - Compte les utilisateurs
- `initializeUsersCollection()` - Initialise les index

## Préparation pour l'authentification

Ce package est conçu pour être étendu avec l'authentification. Prochaines étapes :

1. Ajouter le hashage des mots de passe avec `bcrypt`
2. Implémenter la vérification des mots de passe
3. Ajouter des champs comme `emailVerified`, `resetToken`, etc.
4. Intégrer avec NextAuth.js ou une solution d'authentification similaire

## Structure des fichiers

```
packages/database/
├── src/
│   ├── index.ts           # Point d'entrée du package
│   ├── mongodb-client.ts  # Client MongoDB et utilitaires
│   └── user.ts            # Modèle User et opérations CRUD
├── package.json
├── tsconfig.json
├── eslint.config.js
└── README.md
```
