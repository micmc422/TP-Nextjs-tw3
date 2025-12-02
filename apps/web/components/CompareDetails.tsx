"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Badge } from "@workspace/ui/components/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@workspace/ui/components/table"
import { ComparePokemon } from "./PokemonCompareContext"
import Image from "next/image"
import { ArrowUp, ArrowDown, Minus } from "lucide-react"

interface CompareDetailsProps {
  pokemon: ComparePokemon[]
}

// Type colors map
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

const statTranslation: Record<string, string> = {
  hp: "PV",
  attack: "Attaque",
  defense: "Défense",
  "special-attack": "Atq. Spéciale",
  "special-defense": "Déf. Spéciale",
  speed: "Vitesse",
}

function StatCompareIndicator({ values, currentIndex }: { values: number[]; currentIndex: number }) {
  const currentValue = values[currentIndex]
  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  
  if (currentValue === maxValue && maxValue !== minValue) {
    return <ArrowUp className="w-4 h-4 text-green-500 inline ml-1" />
  }
  if (currentValue === minValue && maxValue !== minValue) {
    return <ArrowDown className="w-4 h-4 text-red-500 inline ml-1" />
  }
  return <Minus className="w-4 h-4 text-muted-foreground inline ml-1" />
}

export function CompareDetails({ pokemon }: CompareDetailsProps) {
  const statNames = pokemon[0]?.stats.map((s) => s.stat.name) || []

  return (
    <div className="space-y-6">
      {/* Pokemon Cards */}
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

      {/* Stats Comparison Table */}
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

      {/* Physical Characteristics */}
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

      {/* Abilities Comparison */}
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
                      {a.is_hidden && <span className="ml-1 opacity-50">(H)</span>}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Type Differences */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Analyse des types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Common types */}
            {(() => {
              const allTypes = pokemon.flatMap((p) => p.types.map((t) => t.type.name))
              const typeCount = allTypes.reduce((acc, type) => {
                acc[type] = (acc[type] || 0) + 1
                return acc
              }, {} as Record<string, number>)
              
              const commonTypes = Object.entries(typeCount)
                .filter(([, count]) => count > 1)
                .map(([type]) => type)
              
              const uniqueTypes = Object.entries(typeCount)
                .filter(([, count]) => count === 1)
                .map(([type]) => type)

              return (
                <>
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
                </>
              )
            })()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
