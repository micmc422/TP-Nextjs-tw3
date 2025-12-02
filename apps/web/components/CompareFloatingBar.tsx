"use client"

import { useCompare } from "./PokemonCompareContext"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { X, GitCompare, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function CompareFloatingBar() {
  const { selectedPokemon, removePokemon, clearSelection } = useCompare()

  if (selectedPokemon.length === 0) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <Card className="flex items-center gap-3 p-3 shadow-xl border-2 bg-background/95 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          {selectedPokemon.map((pokemon) => (
            <div key={pokemon.id} className="relative group">
              <div className="w-12 h-12 rounded-full bg-muted/50 overflow-hidden border-2 border-muted">
                <Image
                  src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                  alt={pokemon.name}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              <button
                onClick={() => removePokemon(pokemon.id)}
                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                title={`Retirer ${pokemon.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {/* Empty slots */}
          {Array.from({ length: 4 - selectedPokemon.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground/30"
            />
          ))}
        </div>

        <div className="flex items-center gap-2 ml-2">
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {selectedPokemon.length}/4
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={clearSelection}
            title="Vider la sélection"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          <Link href="/pokemon/compare">
            <Button disabled={selectedPokemon.length < 2} size="sm" className="gap-2">
              <GitCompare className="w-4 h-4" />
              <span className="hidden sm:inline">Comparer</span>
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
