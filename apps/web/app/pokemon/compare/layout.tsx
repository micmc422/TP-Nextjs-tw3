import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Comparer des Pokémon",
  description: "Comparez les statistiques, types et caractéristiques de différents Pokémon côte à côte.",
  keywords: ["Pokémon", "comparaison", "statistiques", "types"],
  openGraph: {
    title: "Comparer des Pokémon | Pokédex",
    description: "Comparez les statistiques, types et caractéristiques de différents Pokémon côte à côte.",
  },
}

export default function CompareLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
