/**
 * Composant Providers - Wrapper de Contextes React
 * 
 * Ce fichier centralise tous les Context Providers nécessaires à l'application.
 * Il doit être un Client Component car les providers utilisent des hooks React.
 * 
 * Concepts clés pour les étudiants :
 * - Les Context Providers permettent de partager des données dans l'arbre de composants
 * - "use client" est obligatoire car les providers utilisent useState/useContext
 * - L'ordre d'imbrication des providers peut être important
 * - ThemeProvider gère le mode sombre/clair de l'application
 * - CompareProvider gère l'état de comparaison des Pokémon
 */

"use client"

import * as React from "react"
// Provider pour la gestion du thème (mode sombre/clair)
import { ThemeProvider as NextThemesProvider } from "next-themes"
// Provider personnalisé pour la fonctionnalité de comparaison de Pokémon
import { CompareProvider } from "./PokemonCompareContext"

/**
 * Composant Providers - Enveloppe l'application avec les contextes nécessaires
 * 
 * @param children - Les composants enfants qui auront accès aux contextes
 * 
 * Organisation des providers :
 * 1. ThemeProvider : En premier pour que le thème soit disponible partout
 * 2. CompareProvider : Pour la fonctionnalité de comparaison de Pokémon
 * 
 * Note : Ajouter de nouveaux providers ici plutôt que dans layout.tsx
 * pour une meilleure organisation et maintenabilité du code.
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"              // Utilise une classe CSS pour le thème
      defaultTheme="system"          // Utilise le thème du système par défaut
      enableSystem                   // Active la détection du thème système
      disableTransitionOnChange      // Évite les animations lors du changement de thème
      enableColorScheme              // Active le support de color-scheme CSS
    >
      <CompareProvider>
        {children}
      </CompareProvider>
    </NextThemesProvider>
  )
}
