/**
 * Page d'Accueil de l'Application
 * 
 * Ce fichier représente la page principale accessible à la racine du site (/).
 * Dans Next.js App Router, le fichier `page.tsx` définit le contenu d'une route.
 * 
 * Concepts clés pour les étudiants :
 * - Les pages sont des Server Components par défaut (rendu côté serveur)
 * - Chaque dossier dans `app/` peut avoir son propre `page.tsx`
 * - Les métadonnées peuvent être exportées pour le SEO
 * - Les composants importés de @workspace/* viennent du monorepo (dossier packages/)
 */

import type { Metadata } from "next"
// Composants locaux de l'application (préfixe @/ = alias vers le dossier racine de l'app)
import { ProjectStructure } from "@/components/ProjectStructure"
import { Text } from "@/components/Text"
import { Title } from "@/components/Title"
import { MonorepoAdvantages } from "@/app/MonorepoAdvantages"
import { TurboJsonExplanation } from "@/app/TurboJsonExplanation"
// Composant Button importé depuis le package UI partagé du monorepo
import { Button } from "@workspace/ui/components/button"

/**
 * Métadonnées spécifiques à cette page
 * Ces métadonnées fusionnent avec celles du layout parent
 */
export const metadata: Metadata = {
  title: "Accueil", // Sera transformé en "Accueil | Next.js Avancé" grâce au template du layout
  description: "Bienvenue dans cette application Next.js avancée avec une configuration monorepo et des composants réutilisables. Découvrez l'architecture moderne avec Turborepo.",
  openGraph: {
    title: "Next.js Avancé | Monorepo TP",
    description: "Bienvenue dans cette application Next.js avancée avec une configuration monorepo et des composants réutilisables.",
  },
};

/**
 * Composant Page - La page d'accueil de l'application
 * 
 * C'est un Server Component : il est rendu côté serveur et envoyé au client en HTML.
 * Avantages : meilleur SEO, chargement initial plus rapide, accès direct aux données.
 */
export default function Page() {
  return (
    <div className="flex flex-col items-center min-h-svh py-10 sm:py-16 md:py-20 gap-12 sm:gap-16 md:gap-20">
      {/* 
        Section Hero (en-tête principale)
        Utilise une grille responsive : colonne sur mobile, ligne sur desktop (lg:flex-row)
      */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-24 w-full max-w-7xl px-4 sm:px-6">
        {/* Colonne de gauche : Texte d'introduction et boutons d'action */}
        <div className="flex flex-col items-center lg:items-start justify-center gap-4 sm:gap-6 max-w-xl text-center lg:text-left">
          <Title level="homepage">Next.js Avancé</Title>
          <Text size="lead">
            Bienvenue dans cette application Next.js avancée avec une configuration
            monorepo et des composants réutilisables !
          </Text>
          {/* Boutons d'action - responsive avec flexbox */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
             <Button variant="default" className="w-full sm:w-auto">Commencer le TP</Button>
             <Button variant="outline" className="w-full sm:w-auto">Documentation</Button>
          </div>
        </div>
        {/* Colonne de droite : Visualisation de la structure du projet */}
        <div className="flex flex-col items-center justify-center gap-4 w-full max-w-md">
          <ProjectStructure className="w-full shadow-xl rounded-xl border bg-card" />
        </div>
      </div>

      {/* 
        Section Éducative
        Contient les explications sur le monorepo et Turborepo
      */}
      <div className="w-full max-w-7xl px-4 sm:px-6 space-y-12 sm:space-y-16 md:space-y-20">
        <MonorepoAdvantages />
        <TurboJsonExplanation />
      </div>
    </div>
  )
}
