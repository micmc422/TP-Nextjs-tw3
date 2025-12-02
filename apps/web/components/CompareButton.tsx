"use client"

import { useCompare, ComparePokemon } from "./PokemonCompareContext"
import { Button } from "@workspace/ui/components/button"
import { Plus, Check } from "lucide-react"

interface CompareButtonProps {
  pokemon: ComparePokemon
  variant?: "icon" | "full"
  className?: string
}

export function CompareButton({ pokemon, variant = "full", className }: CompareButtonProps) {
  const { addPokemon, removePokemon, isSelected, canAddMore } = useCompare()
  const selected = isSelected(pokemon.id)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (selected) {
      removePokemon(pokemon.id)
    } else {
      addPokemon(pokemon)
    }
  }

  if (variant === "icon") {
    return (
      <Button
        variant={selected ? "default" : "outline"}
        size="icon"
        onClick={handleClick}
        disabled={!selected && !canAddMore}
        className={className}
        title={selected ? "Retirer de la comparaison" : "Ajouter à la comparaison"}
      >
        {selected ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
      </Button>
    )
  }

  return (
    <Button
      variant={selected ? "default" : "outline"}
      size="sm"
      onClick={handleClick}
      disabled={!selected && !canAddMore}
      className={`gap-2 ${className}`}
    >
      {selected ? (
        <>
          <Check className="w-4 h-4" />
          Dans la comparaison
        </>
      ) : (
        <>
          <Plus className="w-4 h-4" />
          Comparer
        </>
      )}
    </Button>
  )
}
