"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, Legend, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { ComparePokemon } from "./PokemonCompareContext"

interface CompareStatsChartProps {
  pokemon: ComparePokemon[]
}

// Colors for each Pokemon in comparison
const POKEMON_COLORS = [
  { fill: "hsl(220, 70%, 50%)", stroke: "hsl(220, 70%, 40%)" },   // Blue
  { fill: "hsl(0, 70%, 50%)", stroke: "hsl(0, 70%, 40%)" },       // Red
  { fill: "hsl(120, 70%, 40%)", stroke: "hsl(120, 70%, 30%)" },   // Green
  { fill: "hsl(280, 70%, 50%)", stroke: "hsl(280, 70%, 40%)" },   // Purple
]

const statTranslation: Record<string, string> = {
  hp: "PV",
  attack: "Attaque",
  defense: "Défense",
  "special-attack": "Atq. Spé",
  "special-defense": "Déf. Spé",
  speed: "Vitesse",
}

export function CompareStatsChart({ pokemon }: CompareStatsChartProps) {
  // Get all stat names from the first Pokemon
  const statNames = pokemon[0]?.stats.map((s) => s.stat.name) || []

  // Create chart data with stats for each Pokemon
  const chartData = statNames.map((statName) => {
    const dataPoint: Record<string, string | number> = {
      stat: statTranslation[statName] || statName,
    }
    
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
        <div className="w-full h-[350px] sm:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="stat" tick={{ fontSize: 11 }} />
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
