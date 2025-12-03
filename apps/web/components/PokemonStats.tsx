/**
 * Composant de Graphique Radar pour les Statistiques Pokémon
 * 
 * Ce composant utilise Recharts pour afficher les statistiques d'un Pokémon
 * sous forme de graphique radar (toile d'araignée).
 * 
 * Concepts clés pour les étudiants :
 * - Intégration de librairies de visualisation (Recharts)
 * - Transformation de données API en format chart
 * - Composants Chart personnalisés avec shadcn/ui
 * - Localisation des labels (traduction en français)
 */

"use client"

// Composants Recharts pour le graphique radar
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

// Composants Chart personnalisés du package UI
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

/**
 * Props du composant PokemonStats
 * @param stats - Tableau des statistiques du Pokémon depuis l'API
 */
interface PokemonStatsProps {
  stats: {
    base_stat: number
    stat: {
      name: string
    }
  }[]
}

/**
 * Configuration du graphique pour les statistiques
 * Définit les labels et couleurs utilisés par ChartContainer
 */
const chartConfig = {
  stats: {
    label: "Statistiques",
    color: "hsl(var(--chart-1))", // Utilise la variable CSS du thème
  },
} satisfies ChartConfig

/**
 * Composant PokemonStats - Graphique radar des statistiques
 * 
 * Affiche les 6 statistiques principales d'un Pokémon :
 * - PV (HP)
 * - Attaque
 * - Défense
 * - Attaque Spéciale
 * - Défense Spéciale
 * - Vitesse
 * 
 * @param stats - Statistiques du Pokémon depuis l'API PokeAPI
 */
export function PokemonStats({ stats }: PokemonStatsProps) {
  /**
   * Mapping pour traduire les noms de stats en français
   * Les noms viennent de l'API en anglais (hp, attack, defense, etc.)
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
   * Transformation des données pour Recharts
   * Chaque statistique devient un point sur le graphique radar
   */
  const chartData = stats.map((s) => ({
    subject: statTranslation[s.stat.name] || s.stat.name, // Nom traduit
    value: s.base_stat,    // Valeur de la statistique
    fullMark: 255,         // Valeur maximale théorique (pour l'échelle)
  }))

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-2 sm:pb-4">
        <CardTitle className="text-base sm:text-lg">Statistiques (Radar)</CardTitle>
      </CardHeader>
      <CardContent className="pb-0 px-2 sm:px-6">
        {/* ChartContainer gère le responsive et le thème */}
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] sm:max-h-[300px]"
        >
          {/* RadarChart de Recharts */}
          <RadarChart data={chartData}>
            {/* Tooltip au survol */}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {/* Grille de fond avec opacité */}
            <PolarGrid className="fill-[--color-chart-1] opacity-20" />
            {/* Labels des axes (noms des stats) */}
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10 }} />
            {/* Zone du radar (les valeurs) */}
            <Radar
              dataKey="value"
              name="Stats"
              fill="var(--color-chart-1)"
              fillOpacity={0.5}
              stroke="var(--color-chart-1)"
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
