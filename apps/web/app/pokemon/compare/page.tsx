"use client"

import { useCompare } from "@/components/PokemonCompareContext"
import { CompareStatsChart } from "@/components/CompareStatsChart"
import { CompareDetails } from "@/components/CompareDetails"
import { Title } from "@/components/Title"
import { Text } from "@/components/Text"
import { Button } from "@workspace/ui/components/button"
import Link from "next/link"
import { ArrowLeft, Trash2 } from "lucide-react"

export default function ComparePage() {
  const { selectedPokemon, clearSelection } = useCompare()

  if (selectedPokemon.length < 2) {
    return (
      <div className="container mx-auto py-10 px-4 text-center">
        <Title level="h1" className="mb-4">Comparaison de Pokémon</Title>
        <Text className="mb-6">
          Sélectionnez au moins 2 Pokémon pour les comparer.
          <br />
          Vous pouvez ajouter jusqu&apos;à 4 Pokémon à la comparaison.
        </Text>
        <Link href="/pokemon">
          <Button className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Retour au Pokédex
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 sm:py-8 md:py-10 px-4 max-w-6xl space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
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
        <Button variant="destructive" size="sm" onClick={clearSelection} className="gap-2">
          <Trash2 className="w-4 h-4" />
          Effacer la sélection
        </Button>
      </div>

      {/* Overlapping Radar Chart */}
      <CompareStatsChart pokemon={selectedPokemon} />

      {/* Detailed Comparison */}
      <CompareDetails pokemon={selectedPokemon} />
    </div>
  )
}
