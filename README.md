# Modèle monorepo shadcn/ui

Ce modèle est conçu pour créer un monorepo avec shadcn/ui.

## 🚀 Démarrage rapide

### Option 1: Dev Container (Recommandé)

Le projet inclut une configuration de Dev Container qui configure automatiquement l'environnement de développement avec MongoDB.

#### VS Code / GitHub Codespaces

1. Installez [VS Code](https://code.visualstudio.com/) et l'extension [Dev Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
2. Ouvrez le projet dans VS Code
3. Cliquez sur le popup "Reopen in Container" ou utilisez la commande `Dev Containers: Reopen in Container`
4. Le container se lancera automatiquement avec MongoDB prêt à l'emploi

### Option 2: CodeSandbox (Idéal pour les postes universitaires)

Vous pouvez travailler sur ce projet directement dans votre navigateur avec CodeSandbox :

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/github/micmc422/TP-Nextjs-tw3)

> 💡 C'est la solution idéale si un poste universitaire est indisponible ou dysfonctionnel. MongoDB est automatiquement démarré grâce à la configuration dans `.codesandbox/tasks.json`.

### Option 3: Installation locale

Si vous préférez travailler en local sans Dev Container :

1. Installez [Docker](https://docs.docker.com/get-docker/) et [Docker Compose](https://docs.docker.com/compose/install/)
2. Installez [Node.js 20+](https://nodejs.org/)
3. Installez [pnpm](https://pnpm.io/installation)

```bash
# Activer Corepack pour pnpm
corepack enable

# Installer les dépendances
pnpm install

# Démarrer MongoDB avec Docker
docker compose up -d

# Construire les packages
pnpm --filter=./packages/* build

# Lancer le serveur de développement
pnpm dev:app
```

## 📦 Base de données MongoDB

Le projet utilise MongoDB pour la persistance des données. La configuration Docker Compose lance automatiquement une instance MongoDB accessible sur `mongodb://localhost:27017`.

Pour plus de détails sur l'utilisation de la base de données, consultez le [README du package database](./packages/database/README.md).

### Commandes Docker utiles

```bash
# Démarrer MongoDB
docker compose up -d

# Arrêter MongoDB
docker compose down

# Voir les logs MongoDB
docker compose logs -f mongodb

# Accéder au shell MongoDB
docker exec -it tp-nextjs-mongodb mongosh
```

## Utilisation

```bash
pnpm dlx shadcn@latest init
```

## Ajouter des composants

Pour ajouter des composants à votre application, exécutez la commande suivante à la racine de votre application `web` :

```bash
pnpm dlx shadcn@latest add button -c apps/web
```

Cela placera les composants UI dans le répertoire `packages/ui/src/components`.

## Tailwind

Votre `tailwind.config.ts` et `globals.css` sont déjà configurés pour utiliser les composants du package `ui`.

## Utilisation des composants

Pour utiliser les composants dans votre application, importez-les depuis le package `ui`.

```tsx
import { Button } from "@workspace/ui/components/button"
```
