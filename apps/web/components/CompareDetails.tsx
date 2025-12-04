/**
 * Composant CompareDetails - Tableau de Comparaison Détaillé
 * 
 * Ce composant affiche une comparaison détaillée de plusieurs Pokémon
 * sous forme de tableaux et de cartes. Il présente les statistiques,
 * caractéristiques physiques, talents et analyse des types.
 * 
 * Concepts clés pour les étudiants :
 * - Composants Table de shadcn/ui pour les données tabulaires
 * - useMemo pour optimiser les calculs dérivés
 * - Indicateurs visuels (flèches) pour les valeurs max/min
 * - Analyse de données : types communs et uniques
 * 
 * Structure de l'affichage :
 * 1. Cartes Pokémon : aperçu visuel de chaque Pokémon
 * 2. Tableau des statistiques : comparaison des 6 stats de base
 * 3. Caractéristiques physiques : taille et poids
 * 4. Talents : liste des talents normaux et cachés
 * 5. Analyse des types : types en commun et uniques
 */

"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { ComparePokemon } from "./PokemonCompareContext"
import Image from "next/image"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"
import { useMemo } from "react"

/**
 * Props du composant CompareDetails
 * @property pokemon - Tableau des Pokémon à comparer
 */
interface CompareDetailsProps {
  pokemon: ComparePokemon[]
}

/**
 * Couleurs CSS Tailwind pour chaque type de Pokémon
 * Utilisées pour les badges et indicateurs visuels
 */
const typeColors: Record<string, string> = {
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-500",
  psychic: "bg-pink-500",
  ice: "bg-cyan-500",
  dragon: "bg-indigo-500",
  dark: "bg-slate-800",
  fairy: "bg-rose-400",
  normal: "bg-gray-400",
  fighting: "bg-orange-700",
  flying: "bg-sky-400",
  poison: "bg-purple-500",
  ground: "bg-amber-600",
  rock: "bg-stone-500",
  bug: "bg-lime-500",
  ghost: "bg-violet-700",
  steel: "bg-slate-400",
}

/**
 * Traduction des noms de statistiques vers le français
 */
const statTranslation: Record<string, string> = {
  hp: "PV",
  attack: "Attaque",
  defense: "Défense",
  "special-attack": "Atq. Spéciale",
  "special-defense": "Déf. Spéciale",
  speed: "Vitesse",
}

/**
 * Composant StatCompareIndicator - Indicateur visuel de comparaison
 * 
 * Affiche une flèche pour indiquer si une valeur est la plus haute,
 * la plus basse, ou égale aux autres.
 * 
 * @param values - Tableau de toutes les valeurs à comparer
 * @param currentIndex - Index de la valeur actuelle
 */
function StatCompareIndicator({ values, currentIndex }: { values: number[]; currentIndex: number }) {
  const currentValue = values[currentIndex]
  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  
  // Flèche verte vers le haut pour la valeur maximale
  if (currentValue === maxValue && maxValue !== minValue) {
    return <ArrowUp className="w-4 h-4 text-green-500 inline ml-1" />
  }
  // Flèche rouge vers le bas pour la valeur minimale
  if (currentValue === minValue && maxValue !== minValue) {
    return <ArrowDown className="w-4 h-4 text-red-500 inline ml-1" />
  }
  // Tiret gris si toutes les valeurs sont égales
  return <Minus className="w-4 h-4 text-muted-foreground inline ml-1" />
}

/**
 * Analyse les types des Pokémon pour trouver les types communs et uniques
 * 
 * @param pokemon - Tableau des Pokémon à analyser
 * @returns Objet contenant commonTypes et uniqueTypes
 * 
 * Exemple :
 * - Si 2 Pokémon ont le type "fire" → "fire" est dans commonTypes
 * - Si un seul Pokémon a le type "flying" → "flying" est dans uniqueTypes
 */
function analyzeTypes(pokemon: ComparePokemon[]) {
  // Extrait tous les types de tous les Pokémon
  const allTypes = pokemon.flatMap((p) => p.types.map((t) => t.type.name))
  
  // Compte les occurrences de chaque type
  const typeCount = allTypes.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  // Types présents chez plus d'un Pokémon
  const commonTypes = Object.entries(typeCount)
    .filter(([, count]) => count > 1)
    .map(([type]) => type)
  
  // Types présents chez un seul Pokémon
  const uniqueTypes = Object.entries(typeCount)
    .filter(([, count]) => count === 1)
    .map(([type]) => type)

  return { commonTypes, uniqueTypes }
}

/**
 * Composant CompareDetails - Interface complète de comparaison
 * 
 * Affiche plusieurs sections de comparaison :
 * 1. Cartes avec aperçu de chaque Pokémon
 * 2. Tableau des statistiques de combat
 * 3. Tableau des caractéristiques physiques
 * 4. Grille des talents
 * 5. Analyse des types (communs et uniques)
 */
export function CompareDetails({ pokemon }: CompareDetailsProps) {
  // Récupère les noms des statistiques depuis le premier Pokémon
  const statNames = pokemon[0]?.stats.map((s) => s.stat.name) || []
  
  // Mémorise l'analyse des types pour éviter les recalculs inutiles
  const { commonTypes, uniqueTypes } = useMemo(() => analyzeTypes(pokemon), [pokemon])

  return (
    <div className="space-y-6">
      {/* Section : Cartes d'aperçu des Pokémon */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {pokemon.map((p) => (
          <Card key={p.id} className="text-center">
            <CardContent className="p-4">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <Image
                  src={p.sprites.other['official-artwork'].front_default || p.sprites.front_default}
                  alt={p.name}
                  fill
                  className="object-contain"
                />
              </div>
              <h3 className="font-semibold capitalize text-lg">{p.name}</h3>
              <p className="text-sm text-muted-foreground">#{String(p.id).padStart(3, '0')}</p>
              <div className="flex flex-wrap gap-1 justify-center mt-2">
                {p.types.map((t) => (
                  <Badge
                    key={t.type.name}
                    className={`text-white text-xs capitalize ${typeColors[t.type.name] || 'bg-gray-500'}`}
                  >
                    {t.type.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Section : Tableau de comparaison des statistiques */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Statistiques détaillées</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Statistique</TableHead>
                  {pokemon.map((p) => (
                    <TableHead key={p.id} className="text-center capitalize">
                      {p.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {statNames.map((statName) => {
                  // Collecte les valeurs de cette stat pour tous les Pokémon
                  const values = pokemon.map(
                    (p) => p.stats.find((s) => s.stat.name === statName)?.base_stat || 0
                  )
                  return (
                    <TableRow key={statName}>
                      <TableCell className="font-medium">
                        {statTranslation[statName] || statName}
                      </TableCell>
                      {pokemon.map((p, index) => {
                        const stat = p.stats.find((s) => s.stat.name === statName)
                        return (
                          <TableCell key={p.id} className="text-center">
                            <span className="font-mono">{stat?.base_stat || 0}</span>
                            <StatCompareIndicator values={values} currentIndex={index} />
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })}
                {/* Ligne du total des statistiques */}
                <TableRow className="font-bold bg-muted/50">
                  <TableCell>Total</TableCell>
                  {pokemon.map((p) => {
                    const total = p.stats.reduce((sum, s) => sum + s.base_stat, 0)
                    const allTotals = pokemon.map((pk) =>
                      pk.stats.reduce((sum, s) => sum + s.base_stat, 0)
                    )
                    return (
                      <TableCell key={p.id} className="text-center">
                        <span className="font-mono">{total}</span>
                        <StatCompareIndicator
                          values={allTotals}
                          currentIndex={pokemon.indexOf(p)}
                        />
                      </TableCell>
                    )
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Section : Caractéristiques physiques (taille et poids) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Caractéristiques physiques</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Caractéristique</TableHead>
                  {pokemon.map((p) => (
                    <TableHead key={p.id} className="text-center capitalize">
                      {p.name}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Taille</TableCell>
                  {pokemon.map((p, index) => {
                    const heights = pokemon.map((pk) => pk.height)
                    return (
                      <TableCell key={p.id} className="text-center">
                        <span className="font-mono">{p.height / 10} m</span>
                        <StatCompareIndicator values={heights} currentIndex={index} />
                      </TableCell>
                    )
                  })}
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Poids</TableCell>
                  {pokemon.map((p, index) => {
                    const weights = pokemon.map((pk) => pk.weight)
                    return (
                      <TableCell key={p.id} className="text-center">
                        <span className="font-mono">{p.weight / 10} kg</span>
                        <StatCompareIndicator values={weights} currentIndex={index} />
                      </TableCell>
                    )
                  })}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Section : Comparaison des talents (abilities) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Talents (Abilities)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {pokemon.map((p) => (
              <div key={p.id}>
                <h4 className="font-medium capitalize mb-2 text-center">{p.name}</h4>
                <div className="flex flex-wrap gap-1 justify-center">
                  {p.abilities.map((a) => (
                    <Badge
                      key={a.ability.name}
                      variant={a.is_hidden ? "outline" : "secondary"}
                      className="capitalize text-xs"
                    >
                      {a.ability.name.replace('-', ' ')}
                      {/* (H) indique un talent caché */}
                      {a.is_hidden && <span className="ml-1 opacity-50">(H)</span>}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Section : Analyse des types (communs et uniques) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Analyse des types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Types partagés par plusieurs Pokémon */}
            {commonTypes.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Types en commun</h4>
                <div className="flex flex-wrap gap-2">
                  {commonTypes.map((type) => (
                    <Badge
                      key={type}
                      className={`text-white capitalize ${typeColors[type] || 'bg-gray-500'}`}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            {/* Types présents chez un seul Pokémon */}
            {uniqueTypes.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Types uniques</h4>
                <div className="flex flex-wrap gap-2">
                  {uniqueTypes.map((type) => (
                    <Badge
                      key={type}
                      variant="outline"
                      className={`capitalize ${typeColors[type] || ''}`}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
