/**
 * Layout Racine de l'Application Next.js
 * 
 * Ce fichier définit le layout principal qui enveloppe TOUTES les pages de l'application.
 * Dans Next.js App Router, le fichier `layout.tsx` à la racine du dossier `app/` est obligatoire
 * et définit la structure HTML de base (<html> et <body>).
 * 
 * Concepts clés pour les étudiants :
 * - Les layouts sont des composants serveur par défaut (Server Components)
 * - Ils persistent entre les navigations (ne se re-rendent pas à chaque changement de page)
 * - Les enfants (pages) sont injectés via la prop `children`
 * - Les métadonnées peuvent être définies via l'export `metadata`
 */

import type { Metadata } from "next"
// Importation des polices Geist depuis le package 'geist' pour une typographie moderne
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

// Importation des styles globaux depuis le package @workspace/ui (monorepo)
// Cela démontre le partage de code entre packages dans un monorepo
import "@workspace/ui/globals.css"

// Composants locaux de l'application
import { Providers } from "@/components/providers"
import { NavigationMain } from "@/components/NavigationMain"
import { CompareFloatingBar } from "@/components/CompareFloatingBar"

/**
 * Métadonnées de l'application pour le SEO et les réseaux sociaux
 * 
 * Next.js génère automatiquement les balises <meta> correspondantes.
 * - `title.template` : permet de formater les titres des pages enfants
 * - `openGraph` : métadonnées pour le partage sur les réseaux sociaux
 */
export const metadata: Metadata = {
  title: {
    default: "Next.js Avancé | Monorepo TP",
    template: "%s | Next.js Avancé", // Le %s sera remplacé par le titre de chaque page
  },
  description: "Application Next.js avancée avec configuration monorepo et composants réutilisables. Découvrez les bonnes pratiques du développement moderne.",
  keywords: ["Next.js", "React", "Monorepo", "Turborepo", "TypeScript", "Tailwind CSS"],
  authors: [{ name: "TP Next.js" }],
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Next.js Avancé",
  },
  twitter: {
    card: "summary_large_image",
  },
};

/**
 * Composant RootLayout - Le layout racine de l'application
 * 
 * @param children - Les pages enfants qui seront rendues à l'intérieur du layout
 * 
 * Note importante : Ce composant retourne les balises <html> et <body>,
 * ce qui est obligatoire uniquement pour le layout racine.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    // suppressHydrationWarning évite les avertissements d'hydratation liés aux thèmes
    <html lang="en" suppressHydrationWarning>
      <body
        // Application des variables CSS pour les polices Geist
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased `}
      >
        {/* 
          Providers enveloppe l'application avec les contextes nécessaires :
          - ThemeProvider pour le mode sombre/clair
          - CompareProvider pour la comparaison de Pokémon
        */}
        <Providers>
          {/* Navigation principale affichée sur toutes les pages */}
          <NavigationMain />
          {/* Zone de contenu où les pages enfants seront rendues */}
          {children}
          {/* Barre flottante pour la comparaison de Pokémon */}
          <CompareFloatingBar />
          </Providers>
      </body>
    </html>
  )
}
