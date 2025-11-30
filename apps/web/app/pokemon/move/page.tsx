import type { Metadata } from "next";
import { PokeAPI } from "@workspace/pokeapi";
import { MoveInfiniteList } from "@/components/MoveInfiniteList";
import { Title } from "@/components/Title";
import { Text } from "@/components/Text";

// Prevent static generation - fetch at runtime
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Capacités",
  description: "Explorez toutes les capacités du monde Pokémon. Découvrez leurs effets, leur puissance et leur type.",
  keywords: ["Pokémon", "Capacités", "Moves", "liste"],
  openGraph: {
    title: "Capacités | Next.js Avancé",
    description: "Explorez toutes les capacités du monde Pokémon.",
  },
};

export default async function MovePage() {
  const limit = 20;
  const data = await PokeAPI.listMoves(limit, 0);
  const moveList = data.results;

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="flex flex-col items-center text-center space-y-4">
        <Title level="h1">Capacités</Title>
        <Text size="lg" className="max-w-2xl">
          Explorez toutes les capacités du monde Pokémon. 
          Faites défiler pour découvrir plus de capacités et cliquez pour voir les détails !
        </Text>
      </div>

      <MoveInfiniteList 
        initialMoves={moveList}
        initialOffset={limit}
      />
      
      {moveList.length === 0 && (
        <div className="text-center py-20">
            <Text>Aucune capacité trouvée</Text>
        </div>
      )}
    </div>
  );
}
