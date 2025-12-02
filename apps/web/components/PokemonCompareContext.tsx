"use client"

import * as React from "react"

export interface ComparePokemon {
  id: number
  name: string
  types: { type: { name: string } }[]
  stats: { base_stat: number; stat: { name: string } }[]
  height: number
  weight: number
  abilities: { ability: { name: string }; is_hidden: boolean }[]
  sprites: {
    front_default: string
    other: { 'official-artwork': { front_default: string } }
  }
}

interface CompareContextType {
  selectedPokemon: ComparePokemon[]
  addPokemon: (pokemon: ComparePokemon) => void
  removePokemon: (pokemonId: number) => void
  clearSelection: () => void
  isSelected: (pokemonId: number) => boolean
  canAddMore: boolean
}

const CompareContext = React.createContext<CompareContextType | null>(null)

const MAX_COMPARE = 4

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [selectedPokemon, setSelectedPokemon] = React.useState<ComparePokemon[]>([])

  const addPokemon = React.useCallback((pokemon: ComparePokemon) => {
    setSelectedPokemon((prev) => {
      if (prev.length >= MAX_COMPARE) return prev
      if (prev.some((p) => p.id === pokemon.id)) return prev
      return [...prev, pokemon]
    })
  }, [])

  const removePokemon = React.useCallback((pokemonId: number) => {
    setSelectedPokemon((prev) => prev.filter((p) => p.id !== pokemonId))
  }, [])

  const clearSelection = React.useCallback(() => {
    setSelectedPokemon([])
  }, [])

  const isSelected = React.useCallback(
    (pokemonId: number) => selectedPokemon.some((p) => p.id === pokemonId),
    [selectedPokemon]
  )

  const canAddMore = selectedPokemon.length < MAX_COMPARE

  return (
    <CompareContext.Provider
      value={{
        selectedPokemon,
        addPokemon,
        removePokemon,
        clearSelection,
        isSelected,
        canAddMore,
      }}
    >
      {children}
    </CompareContext.Provider>
  )
}

export function useCompare() {
  const context = React.useContext(CompareContext)
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider")
  }
  return context
}
