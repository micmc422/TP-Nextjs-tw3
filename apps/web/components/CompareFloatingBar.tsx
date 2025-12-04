/**
 * Composant CompareFloatingBar - Barre Flottante de Comparaison
 * 
 * Ce composant affiche une barre flottante en bas de l'écran permettant
 * de visualiser et gérer les Pokémon sélectionnés pour la comparaison.
 * 
 * Concepts clés pour les étudiants :
 * - Position fixe (fixed) : reste visible lors du défilement
 * - Rendu conditionnel : ne s'affiche que si des Pokémon sont sélectionnés
 * - État global : utilise le contexte useCompare
 * - Actions interactives : supprimer, vider, accéder à la comparaison
 * 
 * Fonctionnalités :
 * - Affiche les avatars des Pokémon sélectionnés (jusqu'à 4)
 * - Montre les emplacements vides restants
 * - Permet de retirer un Pokémon au survol
 * - Bouton pour vider toute la sélection
 * - Bouton pour accéder à la page de comparaison
 */

"use client"

import { useCompare } from "./PokemonCompareContext"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { X, GitCompare, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

/**
 * Composant CompareFloatingBar - Interface de gestion de la sélection
 * 
 * Ce composant est affiché sur toutes les pages via le layout.tsx.
 * Il permet à l'utilisateur de voir sa sélection en cours et d'accéder
 * à la page de comparaison.
 * 
 * Le composant utilise :
 * - Position fixed pour rester visible
 * - transform: translateX pour centrer horizontalement
 * - z-index élevé pour être au-dessus du contenu
 */
export function CompareFloatingBar() {
  // Récupère l'état et les actions depuis le contexte de comparaison
  const { selectedPokemon, removePokemon, clearSelection } = useCompare()

  // Ne rien afficher si aucun Pokémon n'est sélectionné
  if (selectedPokemon.length === 0) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
      <Card className="flex items-center gap-3 p-3 shadow-xl border-2 bg-background/95 backdrop-blur-sm">
        {/* Affichage des Pokémon sélectionnés */}
        <div className="flex items-center gap-2">
          {selectedPokemon.map((pokemon) => (
            <div key={pokemon.id} className="relative group">
              {/* Avatar circulaire du Pokémon */}
              <div className="w-12 h-12 rounded-full bg-muted/50 overflow-hidden border-2 border-muted">
                <Image
                  src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                  alt={pokemon.name}
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </div>
              {/* Bouton de suppression visible au survol */}
              <button
                onClick={() => removePokemon(pokemon.id)}
                className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                title={`Retirer ${pokemon.name}`}
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          {/* Emplacements vides (cercles en pointillés) */}
          {Array.from({ length: 4 - selectedPokemon.length }).map((_, i) => (
            <div
              key={`empty-${i}`}
              className="w-12 h-12 rounded-full border-2 border-dashed border-muted-foreground/30"
            />
          ))}
        </div>

        {/* Actions : compteur, vider, comparer */}
        <div className="flex items-center gap-2 ml-2">
          {/* Compteur de Pokémon sélectionnés (visible sur desktop) */}
          <span className="text-sm text-muted-foreground hidden sm:inline">
            {selectedPokemon.length}/4
          </span>
          {/* Bouton pour vider la sélection */}
          <Button
            variant="outline"
            size="icon"
            onClick={clearSelection}
            title="Vider la sélection"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
          {/* Lien vers la page de comparaison */}
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
