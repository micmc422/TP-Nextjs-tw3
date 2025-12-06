# Guide de configuration Dev Container

Ce projet inclut une configuration de Dev Container pour un environnement de développement complet avec MongoDB.

## Qu'est-ce qu'un Dev Container?

Un Dev Container est un environnement de développement conteneurisé qui garantit que tous les développeurs travaillent avec exactement les mêmes outils et dépendances. Il utilise Docker pour créer un environnement isolé et reproductible.

## Avantages

- ✅ **Configuration automatique** : Pas besoin d'installer Node.js, pnpm, ou MongoDB localement
- ✅ **Environnement cohérent** : Tous les développeurs utilisent exactement les mêmes versions
- ✅ **Isolation** : Pas de conflit avec d'autres projets sur votre machine
- ✅ **Portable** : Fonctionne sur Windows, Mac, et Linux

## Prérequis

### Pour VS Code (Local)

1. [Docker Desktop](https://www.docker.com/products/docker-desktop/) installé et en cours d'exécution
2. [Visual Studio Code](https://code.visualstudio.com/)
3. Extension [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)

### Pour GitHub Codespaces

Aucun prérequis! Tout fonctionne dans le navigateur.

### Pour CodeSandbox

Aucun prérequis! Tout fonctionne dans le navigateur.

## Utilisation

### Option 1: VS Code avec Dev Containers

1. Clonez le repository
2. Ouvrez le dossier dans VS Code
3. Quand le popup apparaît, cliquez sur "Reopen in Container"
   - Ou utilisez la commande `Dev Containers: Reopen in Container` (Ctrl+Shift+P)
4. Attendez que le container se construise (première fois seulement, ~2-5 minutes)
5. Une fois prêt, le terminal est déjà dans le container avec tout configuré

### Option 2: GitHub Codespaces

1. Sur la page GitHub du repository, cliquez sur "Code" > "Codespaces" > "Create codespace"
2. Attendez que l'environnement se configure
3. Commencez à coder!

### Option 3: CodeSandbox.io

1. Cliquez sur le badge "Open in CodeSandbox" dans le README
2. Ou visitez directement: https://codesandbox.io/p/github/micmc422/TP-Nextjs-tw3
3. L'environnement se configure automatiquement avec MongoDB

## Configuration incluse

### Services Docker

- **app**: Container de développement avec Node.js 20 et pnpm
- **mongodb**: MongoDB 7.0 avec persistance des données

### Ports exposés

- `3000`: Application web (Next.js)
- `3001`: Documentation
- `27017`: MongoDB (pour les outils de gestion de base de données)

### Extensions VS Code installées automatiquement

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- MongoDB for VS Code

### Variables d'environnement

Les variables suivantes sont automatiquement configurées dans le container:

```bash
MONGODB_URI=mongodb://mongodb:27017
MONGODB_DB_NAME=tp-nextjs
```

## Commandes disponibles

Une fois dans le Dev Container:

```bash
# Démarrer le serveur de développement
pnpm dev:app

# Démarrer uniquement l'app web
pnpm --filter web dev

# Démarrer uniquement la documentation
pnpm --filter doc dev

# Builder le projet
pnpm build

# Linter le code
pnpm lint

# Formater le code
pnpm format
```

## Accès à MongoDB

### Via MongoDB for VS Code

L'extension MongoDB for VS Code est préinstallée. Pour vous connecter:

1. Cliquez sur l'icône MongoDB dans la barre latérale
2. Cliquez sur "New Connection"
3. Utilisez la chaîne de connexion: `mongodb://mongodb:27017`

### Via mongosh (CLI)

```bash
# Depuis le terminal du Dev Container
docker exec -it tp-nextjs-mongodb mongosh tp-nextjs

# Exemples de commandes
show collections
db.users.find()
db.stats()
```

### Via le package @workspace/database

```typescript
import { checkConnection, getDatabase } from '@workspace/database';

// Vérifier la connexion
const isConnected = await checkConnection();

// Accéder à la base de données
const db = await getDatabase();
```

## Arrêter et redémarrer

### VS Code

- Pour quitter: Fermez VS Code ou utilisez "Reopen Folder Locally"
- Pour redémarrer: Rouvrez le dossier et cliquez sur "Reopen in Container"

### Docker

```bash
# Arrêter tous les containers
docker compose down

# Démarrer MongoDB uniquement
docker compose up -d mongodb

# Voir les logs
docker compose logs -f mongodb
```

## Résolution de problèmes

### Le container ne démarre pas

1. Assurez-vous que Docker Desktop est en cours d'exécution
2. Vérifiez que vous avez assez d'espace disque (au moins 5 GB libre)
3. Essayez de reconstruire le container: `Dev Containers: Rebuild Container`

### MongoDB n'est pas accessible

```bash
# Vérifier le statut de MongoDB
docker compose ps

# Voir les logs
docker compose logs mongodb

# Redémarrer MongoDB
docker compose restart mongodb
```

### Problèmes de performance

- Sous Windows/Mac, assurez-vous d'utiliser WSL2 ou le système de fichiers optimisé de Docker Desktop
- Augmentez la mémoire allouée à Docker dans les paramètres de Docker Desktop

## Pour les postes universitaires

Si un poste universitaire ne fonctionne pas correctement ou si vous n'avez pas les droits d'installation:

1. **Utilisez CodeSandbox**: C'est la solution la plus simple, tout fonctionne dans le navigateur
2. **Utilisez GitHub Codespaces**: Si votre université a un abonnement GitHub Education
3. **Installation locale minimale**: Si Docker est disponible, utilisez le Dev Container

## Différences entre les environnements

| Fonctionnalité | VS Code + Dev Container | GitHub Codespaces | CodeSandbox |
|----------------|------------------------|-------------------|-------------|
| Installation locale requise | Docker + VS Code | Aucune | Aucune |
| Fonctionne hors ligne | ✅ | ❌ | ❌ |
| Performance | Excellente | Très bonne | Bonne |
| Coût | Gratuit | Gratuit (60h/mois) | Gratuit (6h/jour) |
| Idéal pour | Développement principal | Accès depuis n'importe où | Tests rapides, postes universitaires |

## Support et ressources

- [Documentation Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)
- [Documentation GitHub Codespaces](https://docs.github.com/en/codespaces)
- [Documentation CodeSandbox](https://codesandbox.io/docs)
- [Documentation MongoDB](https://www.mongodb.com/docs/)
