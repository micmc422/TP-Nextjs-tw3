/**
 * Composant BerryStats - Graphique Radar des Saveurs de Baies
 * 
 * Ce composant affiche un graphique radar représentant le profil
 * de saveur d'une baie (épicé, sec, doux, amer, acide).
 * 
 * Concepts clés pour les étudiants :
 * - Recharts : bibliothèque de graphiques React
 * - RadarChart : idéal pour comparer des attributs multiples
 * - Localisation : traduction des saveurs en français
 * - Composants shadcn/ui : Card, ChartContainer
 * 
 * Données de l'API PokeAPI :
 * - potency : intensité de la saveur (0-40 généralement)
 * - flavor.name : nom de la saveur en anglais
 */

"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

/**
 * Props du composant BerryStats
 * 
 * @property flavors - Tableau des saveurs avec leur intensité
 */
interface BerryStatsProps {
  flavors: {
    potency: number        // Intensité de la saveur (0-40+)
    flavor: {
      name: string         // Nom de la saveur en anglais
    }
  }[]
}

/**
 * Configuration du graphique pour les saveurs
 * Définit le label et la couleur de la série
 */
const chartConfig = {
  flavors: {
    label: "Saveurs",
    color: "hsl(var(--chart-2))",  // Couleur du thème
  },
} satisfies ChartConfig

/**
 * Composant BerryStats - Profil de saveur d'une baie
 * 
 * Ce composant :
 * 1. Traduit les noms de saveurs en français
 * 2. Transforme les données pour Recharts
 * 3. Affiche un graphique radar dans une carte
 * 
 * Les 5 saveurs de baies correspondent aux préférences des Pokémon :
 * - Épicé : nature Rigide, Mauvais, etc.
 * - Sec : nature Timide, Modeste, etc.
 * - Doux : nature Jovial, Prudent, etc.
 * - Amer : nature Calme, Gentil, etc.
 * - Acide : nature Hardi, Relax, etc.
 * 
 * @param flavors - Tableau des saveurs de la baie
 */
export function BerryStats({ flavors }: BerryStatsProps) {
  /**
   * Traduction des saveurs de l'anglais vers le français
   * Ces noms correspondent aux préférences de nature des Pokémon
   */
  const flavorTranslation: Record<string, string> = {
    spicy: "Épicé",
    dry: "Sec",
    sweet: "Doux",
    bitter: "Amer",
    sour: "Acide",
  }

  /**
   * Transformation des données pour Recharts
   * 
   * Format produit :
   * [
   *   { subject: "Épicé", value: 10, fullMark: 40 },
   *   { subject: "Sec", value: 0, fullMark: 40 },
   *   ...
   * ]
   * 
   * fullMark définit l'échelle du radar (valeur maximale théorique).
   * La plupart des baies ont des valeurs entre 0 et 40.
   */
  const chartData = flavors.map((f) => ({
    subject: flavorTranslation[f.flavor.name] || f.flavor.name,
    value: f.potency,
    fullMark: 40,  // Valeur max raisonnable pour l'échelle du radar
  }))

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-4">
        <CardTitle>Profil de Saveur</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        {/* ChartContainer gère le responsive et le thème */}
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <RadarChart data={chartData}>
            {/* Tooltip au survol */}
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            {/* Grille de fond avec couleur et transparence */}
            <PolarGrid className="fill-[--color-chart-2] opacity-20" />
            {/* Labels des axes (noms des saveurs) */}
            <PolarAngleAxis dataKey="subject" />
            {/* Zone du radar représentant les valeurs */}
            <Radar
              dataKey="value"
              name="Saveurs"
              fill="var(--color-chart-2)"
              fillOpacity={0.5}
              stroke="var(--color-chart-2)"
              strokeWidth={2}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
