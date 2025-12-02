"use client"

import Link from "next/link"
import { Button } from "@workspace/ui/components/button"
import { AddToCompareButton } from "@/components/AddToCompareButton"

interface PokemonDetailHeaderProps {
  pokemonId: number
  pokemonName: string
}

export function PokemonDetailHeader({ pokemonId, pokemonName }: PokemonDetailHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
      <Link href="/pokemon">
        <Button variant="outline" size="sm" className="text-sm">
          ← Retour au Pokédex
        </Button>
      </Link>
      <AddToCompareButton 
        pokemonId={pokemonId} 
        pokemonName={pokemonName}
        variant="full"
      />
    </div>
  )
}
