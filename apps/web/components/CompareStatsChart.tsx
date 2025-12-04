/**
 * Composant CompareStatsChart - Graphique Radar de Comparaison
 * 
 * Ce composant affiche un graphique radar superposant les statistiques
 * de plusieurs Pokémon pour faciliter leur comparaison visuelle.
 * 
 * Concepts clés pour les étudiants :
 * - Recharts : bibliothèque de graphiques React
 * - RadarChart : graphique en toile d'araignée pour comparer des valeurs
 * - Données superposées : plusieurs séries sur le même graphique
 * - Légende dynamique : générée à partir des données
 * 
 * Différence avec PokemonStats :
 * - PokemonStats : un seul Pokémon, style simplifié
 * - CompareStatsChart : jusqu'à 4 Pokémon, couleurs distinctes
 */

"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, Legend, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { ComparePokemon } from "./PokemonCompareContext"

/**
 * Props du composant CompareStatsChart
 * @property pokemon - Tableau des Pokémon à comparer (2 à 4)
 */
interface CompareStatsChartProps {
  pokemon: ComparePokemon[]
}

/**
 * Couleurs attribuées à chaque Pokémon dans la comparaison
 * 
 * Chaque couleur a :
 * - fill : couleur de remplissage de la zone (avec transparence)
 * - stroke : couleur du contour de la ligne
 * 
 * Les couleurs sont choisies pour être distinctes visuellement :
 * Bleu, Rouge, Vert, Violet
 */
const POKEMON_COLORS = [
  { fill: "hsl(220, 70%, 50%)", stroke: "hsl(220, 70%, 40%)" },   // Bleu
  { fill: "hsl(0, 70%, 50%)", stroke: "hsl(0, 70%, 40%)" },       // Rouge
  { fill: "hsl(120, 70%, 40%)", stroke: "hsl(120, 70%, 30%)" },   // Vert
  { fill: "hsl(280, 70%, 50%)", stroke: "hsl(280, 70%, 40%)" },   // Violet
]

/**
 * Traduction des noms de statistiques de l'anglais vers le français
 * 
 * Les noms viennent de l'API PokeAPI en anglais :
 * hp, attack, defense, special-attack, special-defense, speed
 */
const statTranslation: Record<string, string> = {
  hp: "PV",
  attack: "Attaque",
  defense: "Défense",
  "special-attack": "Atq. Spé",
  "special-defense": "Déf. Spé",
  speed: "Vitesse",
}

/**
 * Composant CompareStatsChart - Graphique de comparaison de statistiques
 * 
 * Ce composant :
 * 1. Récupère les noms de stats du premier Pokémon
 * 2. Construit un dataset avec les valeurs de chaque Pokémon
 * 3. Affiche un RadarChart avec des Radar superposés
 * 4. Ajoute un Tooltip personnalisé et une légende
 * 
 * @param pokemon - Tableau de Pokémon à comparer
 */
export function CompareStatsChart({ pokemon }: CompareStatsChartProps) {
  // Récupère les noms des 6 statistiques depuis le premier Pokémon
  const statNames = pokemon[0]?.stats.map((s) => s.stat.name) || []

  /**
   * Construction des données pour le graphique
   * 
   * Format requis par Recharts :
   * [
   *   { stat: "PV", pokemon0: 45, pokemon1: 60, ... },
   *   { stat: "Attaque", pokemon0: 80, pokemon1: 75, ... },
   *   ...
   * ]
   */
  const chartData = statNames.map((statName) => {
    const dataPoint: Record<string, string | number> = {
      stat: statTranslation[statName] || statName,
    }
    
    // Ajoute la valeur de chaque Pokémon pour cette statistique
    pokemon.forEach((p, index) => {
      const stat = p.stats.find((s) => s.stat.name === statName)
      dataPoint[`pokemon${index}`] = stat?.base_stat || 0
    })
    
    return dataPoint
  })

  return (
    <Card className="w-full">
      <CardHeader className="items-center pb-2">
        <CardTitle className="text-lg">Comparaison des statistiques</CardTitle>
      </CardHeader>
      <CardContent className="pb-2">
        {/* ResponsiveContainer adapte la taille du graphique au conteneur */}
        <div className="w-full h-[350px] sm:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              {/* Grille de fond hexagonale */}
              <PolarGrid />
              {/* Labels des axes (noms des statistiques) */}
              <PolarAngleAxis dataKey="stat" tick={{ fontSize: 11 }} />
              {/* Tooltip personnalisé au survol */}
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload || !payload.length) return null
                  return (
                    <div className="bg-background border rounded-lg p-3 shadow-lg">
                      <p className="font-medium mb-2">{payload[0]?.payload?.stat}</p>
                      {payload.map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span className="capitalize">{pokemon[index]?.name}:</span>
                          <span className="font-medium">{entry.value}</span>
                        </div>
                      ))}
                    </div>
                  )
                }}
              />
              {/* Légende personnalisée avec les noms des Pokémon */}
              <Legend
                content={({ payload }) => (
                  <div className="flex flex-wrap justify-center gap-4 mt-4">
                    {payload?.map((entry, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="capitalize text-sm">{pokemon[index]?.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              />
              {/* Génère un Radar pour chaque Pokémon */}
              {pokemon
                .filter((_, index) => index < POKEMON_COLORS.length)
                .map((p, index) => (
                  <Radar
                    key={p.id}
                    name={p.name}
                    dataKey={`pokemon${index}`}
                    stroke={POKEMON_COLORS[index]!.stroke}
                    fill={POKEMON_COLORS[index]!.fill}
                    fillOpacity={0.2}
                    strokeWidth={2}
                  />
                ))}
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
