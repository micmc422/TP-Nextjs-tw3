import type { Metadata } from "next";
import { PokeAPI } from "@workspace/pokeapi";
import { BerryInfiniteList } from "@/components/BerryInfiniteList";
import { Title } from "@/components/Title";
import { Text } from "@/components/Text";

// Prevent static generation - fetch at runtime
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Baies",
  description: "Explorez toutes les baies du monde Pokémon. Découvrez leurs effets, leur fermeté et leur type de cadeau naturel.",
  keywords: ["Pokémon", "Baies", "Berry", "liste"],
  openGraph: {
    title: "Baies | Next.js Avancé",
    description: "Explorez toutes les baies du monde Pokémon.",
  },
};

export default async function BerryPage() {
  const limit = 20;
  const data = await PokeAPI.listBerries(limit, 0);
  const berryList = data.results;

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="flex flex-col items-center text-center space-y-4">
        <Title level="h1">Baies</Title>
        <Text size="lg" className="max-w-2xl">
          Explorez toutes les baies du monde Pokémon. 
          Faites défiler pour découvrir plus de baies et cliquez pour voir les détails !
        </Text>
      </div>

      <BerryInfiniteList 
        initialBerries={berryList}
        initialOffset={limit}
      />
      
      {berryList.length === 0 && (
        <div className="text-center py-20">
            <Text>Aucune baie trouvée</Text>
        </div>
      )}
    </div>
  );
}
