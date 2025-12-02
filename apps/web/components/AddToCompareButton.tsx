"use client"

import { useCompare, ComparePokemon } from "./PokemonCompareContext"
import { Button } from "@workspace/ui/components/button"
import { Plus, Check, Loader2 } from "lucide-react"
import { useState } from "react"

interface AddToCompareButtonProps {
  pokemonId: number
  pokemonName: string
  variant?: "icon" | "full"
  className?: string
}

export function AddToCompareButton({ 
  pokemonId, 
  pokemonName, 
  variant = "full", 
  className 
}: AddToCompareButtonProps) {
  const { addPokemon, removePokemon, isSelected, canAddMore, selectedPokemon } = useCompare()
  const [loading, setLoading] = useState(false)
  
  const selected = isSelected(pokemonId)
  const existingPokemon = selectedPokemon.find(p => p.id === pokemonId)

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (selected && existingPokemon) {
      removePokemon(pokemonId)
      return
    }

    if (!canAddMore) return

    setLoading(true)
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`)
      if (!res.ok) throw new Error("Failed to fetch Pokemon")
      
      const data = await res.json()
      const pokemon: ComparePokemon = {
        id: data.id,
        name: data.name,
        types: data.types,
        stats: data.stats,
        height: data.height,
        weight: data.weight,
        abilities: data.abilities,
        sprites: data.sprites,
      }
      addPokemon(pokemon)
    } catch (error) {
      console.error("Error fetching Pokemon for comparison:", error)
    } finally {
      setLoading(false)
    }
  }

  if (variant === "icon") {
    return (
      <Button
        variant={selected ? "default" : "outline"}
        size="icon"
        onClick={handleClick}
        disabled={loading || (!selected && !canAddMore)}
        className={className}
        title={selected ? "Retirer de la comparaison" : "Ajouter à la comparaison"}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : selected ? (
          <Check className="w-4 h-4" />
        ) : (
          <Plus className="w-4 h-4" />
        )}
      </Button>
    )
  }

  return (
    <Button
      variant={selected ? "default" : "outline"}
      size="sm"
      onClick={handleClick}
      disabled={loading || (!selected && !canAddMore)}
      className={`gap-2 ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Chargement...
        </>
      ) : selected ? (
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
