/**
 * Contexte React pour la Comparaison de Pokémon
 * 
 * Ce fichier implémente un Context React pour gérer l'état global de la fonctionnalité
 * de comparaison de Pokémon. C'est un exemple classique de gestion d'état avec Context.
 * 
 * Concepts clés pour les étudiants :
 * - React Context permet de partager des données sans prop drilling
 * - Le pattern Provider + Hook personnalisé est très courant
 * - useCallback optimise les performances en mémorisant les fonctions
 * - Le composant doit être un Client Component ("use client")
 * 
 * Architecture :
 * 1. Interface des données (ComparePokemon)
 * 2. Interface du contexte (CompareContextType)
 * 3. Provider (CompareProvider)
 * 4. Hook personnalisé (useCompare)
 */

"use client"

import * as React from "react"

/**
 * Interface définissant les données d'un Pokémon pour la comparaison
 * Contient toutes les informations nécessaires pour l'affichage comparatif
 */
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

/**
 * Interface du contexte de comparaison
 * Définit toutes les valeurs et fonctions disponibles via le contexte
 */
interface CompareContextType {
  selectedPokemon: ComparePokemon[]        // Liste des Pokémon sélectionnés
  addPokemon: (pokemon: ComparePokemon) => void  // Ajouter un Pokémon
  removePokemon: (pokemonId: number) => void     // Retirer un Pokémon par ID
  clearSelection: () => void               // Vider la sélection
  isSelected: (pokemonId: number) => boolean     // Vérifier si sélectionné
  canAddMore: boolean                      // Peut-on encore ajouter ?
}

// Création du contexte avec une valeur par défaut null
const CompareContext = React.createContext<CompareContextType | null>(null)

// Nombre maximum de Pokémon comparables simultanément
const MAX_COMPARE = 4

/**
 * Composant Provider pour la comparaison de Pokémon
 * 
 * Gère l'état de la sélection et fournit les méthodes de manipulation.
 * Utilise useCallback pour optimiser les performances.
 * 
 * @param children - Composants enfants qui auront accès au contexte
 */
export function CompareProvider({ children }: { children: React.ReactNode }) {
  // État local pour stocker les Pokémon sélectionnés
  const [selectedPokemon, setSelectedPokemon] = React.useState<ComparePokemon[]>([])

  /**
   * Ajoute un Pokémon à la sélection
   * Vérifie qu'on n'a pas atteint le max et que le Pokémon n'est pas déjà sélectionné
   */
  const addPokemon = React.useCallback((pokemon: ComparePokemon) => {
    setSelectedPokemon((prev) => {
      // Ne pas ajouter si le maximum est atteint
      if (prev.length >= MAX_COMPARE) return prev
      // Ne pas ajouter si déjà présent
      if (prev.some((p) => p.id === pokemon.id)) return prev
      return [...prev, pokemon]
    })
  }, [])

  /**
   * Retire un Pokémon de la sélection par son ID
   */
  const removePokemon = React.useCallback((pokemonId: number) => {
    setSelectedPokemon((prev) => prev.filter((p) => p.id !== pokemonId))
  }, [])

  /**
   * Vide complètement la sélection
   */
  const clearSelection = React.useCallback(() => {
    setSelectedPokemon([])
  }, [])

  /**
   * Vérifie si un Pokémon est actuellement sélectionné
   * Dépend de selectedPokemon pour être recalculé quand la sélection change
   */
  const isSelected = React.useCallback(
    (pokemonId: number) => selectedPokemon.some((p) => p.id === pokemonId),
    [selectedPokemon]
  )

  // Calcul dérivé : peut-on encore ajouter des Pokémon ?
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

/**
 * Hook personnalisé pour accéder au contexte de comparaison
 * 
 * Lève une erreur si utilisé en dehors du Provider pour un meilleur DX
 * 
 * @returns Les valeurs et fonctions du contexte de comparaison
 * @throws Error si utilisé hors du CompareProvider
 */
export function useCompare() {
  const context = React.useContext(CompareContext)
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider")
  }
  return context
}
