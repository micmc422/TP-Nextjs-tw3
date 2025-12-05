# Documentation - TP Next.js

Documentation complète du projet TP Next.js construite avec [Nextra](https://nextra.site).

## 🌐 Ouvrir dans CodeSandbox

[![Open in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/p/github/micmc422/TP-Nextjs-tw3)

> 💡 Solution de secours si un poste universitaire est indisponible.

## 🚀 Développement

```bash
pnpm dev
```

La documentation sera disponible sur [http://localhost:3001](http://localhost:3001).

## 📦 Build

```bash
pnpm build
```

## 🎨 Structure

```plaintext
content/
├── _meta.ts              # Navigation principale
├── index.mdx             # Page d'accueil
├── guide/                # Guides d'utilisation
│   ├── _meta.ts
│   ├── presentation.mdx
│   ├── getting-started.mdx
│   ├── codesandbox.mdx   # Guide CodeSandbox (secours)
│   ├── architecture.mdx
│   ├── turborepo.mdx
│   ├── nextjs.mdx
│   └── authentification.mdx
└── packages/             # Documentation des packages
    ├── _meta.ts
    ├── presentation.mdx
    ├── ui.mdx
    ├── form.mdx
    ├── pokeapi.mdx
    └── database.mdx
```

## ✨ Fonctionnalités

- **Recherche intégrée** : Recherchez dans toute la documentation
- **Mode sombre** : Thème clair/sombre automatique
- **Responsive** : Optimisé pour mobile et desktop
- **Git timestamps** : Dates de dernière modification en français
- **Bouton copier** : Copiez facilement les blocs de code
- **Navigation** : Pages précédente/suivante automatiques
- **SEO optimisé** : Métadonnées Open Graph complètes

## 📝 Ajouter une nouvelle page

1. Créez un fichier `.mdx` dans le dossier approprié
2. Ajoutez l'entrée dans le fichier `_meta.ts` correspondant
3. La page sera automatiquement ajoutée à la navigation

Exemple :

```typescript
// content/guide/_meta.ts
export default {
  'getting-started': 'Démarrage',
  'new-page': 'Ma nouvelle page', // <- Ajouter ici
}
```

## 🔗 Liens utiles

- [Nextra Documentation](https://nextra.site)
- [Next.js Documentation](https://nextjs.org/docs)
- [Repository GitHub](https://github.com/micmc422/TP-Nextjs-tw3)
