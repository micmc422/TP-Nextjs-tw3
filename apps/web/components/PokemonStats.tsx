"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@workspace/ui/components/chart"
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card"

interface PokemonStatsProps {
  stats: {
    base_stat: number
    stat: {
      name: string
    }
  }[]
}

const chartConfig = {
  stats: {
    label: "Statistiques",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function PokemonStats({ stats }: PokemonStatsProps) {
  // Format data for Recharts
  // Translate stat names to French for better display
  const statTranslation: Record<string, string> = {
    hp: "PV",
    attack: "Attaque",
    defense: "Défense",
    "special-attack": "Atq. Spé",
    "special-defense": "Déf. Spé",
    speed: "Vitesse",
  }

  const chartData = stats.map((s) => ({
    subject: statTranslation[s.stat.name] || s.stat.name,
    value: s.base_stat,
    fullMark: 255, // Max base stat possible
  }))

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-4">
        <CardTitle>Statistiques (Radar)</CardTitle>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <RadarChart data={chartData}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarGrid className="fill-[--color-chart-1] opacity-20" />
            <PolarAngleAxis dataKey="subject" />
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
