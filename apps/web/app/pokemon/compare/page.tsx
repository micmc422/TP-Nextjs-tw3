/**
 * Page de Comparaison de Pokémon
 * 
 * Cette page permet de comparer jusqu'à 4 Pokémon simultanément.
 * Elle illustre l'utilisation de React Context pour l'état partagé.
 * 
 * Concepts clés pour les étudiants :
 * - Utilisation d'un Context global (useCompare)
 * - Composant client ("use client") pour l'interactivité
 * - Rendu conditionnel basé sur l'état
 * - Composants de visualisation (graphiques, tableaux)
 */

"use client"

// Hook personnalisé pour accéder au contexte de comparaison
import { useCompare } from "@/components/PokemonCompareContext"
// Composants de visualisation
import { CompareStatsChart } from "@/components/CompareStatsChart"
import { CompareDetails } from "@/components/CompareDetails"
// Composants de typographie
import { Title } from "@/components/Title"
import { Text } from "@/components/Text"
// Composants UI
import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
// Icônes
import { ArrowLeft, Trash2 } from "lucide-react"

/**
 * Page ComparePage - Interface de comparaison de Pokémon
 * 
 * États possibles :
 * 1. Moins de 2 Pokémon sélectionnés → Message d'invitation
 * 2. 2-4 Pokémon sélectionnés → Interface de comparaison complète
 * 
 * L'état est géré globalement via le CompareContext, permettant
 * de naviguer entre les pages tout en conservant la sélection.
 */
export default function ComparePage() {
  // Récupère l'état de comparaison depuis le Context
  const { selectedPokemon, clearSelection } = useCompare()

  // Affichage si pas assez de Pokémon sélectionnés
  if (selectedPokemon.length < 2) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <Title level="h1" className="mb-4">Comparaison de Pokémon</Title>
        <Text className="mb-6">
          Sélectionnez au moins 2 Pokémon pour les comparer.
          <br />
          Vous pouvez ajouter jusqu&apos;à 4 Pokémon à la comparaison.
        </Text>
        {/* Bouton de retour vers le Pokédex */}
        <Link href="/pokemon">
          <Button className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour au Pokédex
          </Button>
        </Link>
      </div>
    )
  }

  // Affichage de l'interface de comparaison
  return (
    <div className="container mx-auto py-6 sm:py-8 md:py-10 px-4 max-w-6xl space-y-6">
      {/* En-tête avec navigation et actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          {/* Bouton retour */}
          <Link href="/pokemon" className="inline-block mb-2">
            <Button variant="outline" size="sm" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Retour au Pokédex
            </Button>
          </Link>
          <Title level="h1">Comparaison de Pokémon</Title>
          <Text className="text-muted-foreground">
            Comparez les statistiques et caractéristiques de {selectedPokemon.length} Pokémon
          </Text>
        </div>
        {/* Bouton pour vider la sélection */}
        <Button variant="destructive" size="sm" onClick={clearSelection} className="gap-2">
          <Trash2 className="w-4 h-4" />
          Effacer la sélection
        </Button>
      </div>

      {/* Graphique Radar superposé pour la comparaison visuelle */}
      <CompareStatsChart pokemon={selectedPokemon} />

      {/* Tableau de comparaison détaillée */}
      <CompareDetails pokemon={selectedPokemon} />
    </div>
  )
}
