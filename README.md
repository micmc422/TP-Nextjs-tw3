# Modèle monorepo shadcn/ui

Ce modèle est conçu pour créer un monorepo avec shadcn/ui.

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
