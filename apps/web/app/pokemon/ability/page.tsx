import type { Metadata } from "next";
import { PokeAPI } from "@workspace/pokeapi";
import { AbilityInfiniteList } from "@/components/AbilityInfiniteList";
import { Title } from "@/components/Title";
import { Text } from "@/components/Text";

// Prevent static generation - fetch at runtime
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Talents",
  description: "Explorez tous les talents (abilities) du monde Pokémon. Découvrez leurs effets et les Pokémon qui les possèdent.",
  keywords: ["Pokémon", "Talents", "Abilities", "liste"],
  openGraph: {
    title: "Talents | Next.js Avancé",
    description: "Explorez tous les talents du monde Pokémon.",
  },
};

export default async function AbilityPage() {
  const limit = 20;
  const data = await PokeAPI.listAbilities(limit, 0);
  const abilityList = data.results;

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="flex flex-col items-center text-center space-y-4">
        <Title level="h1">Talents</Title>
        <Text size="lg" className="max-w-2xl">
          Explorez tous les talents du monde Pokémon. 
          Faites défiler pour découvrir plus de talents et cliquez pour voir les détails !
        </Text>
      </div>

      <AbilityInfiniteList 
        initialAbilities={abilityList}
        initialOffset={limit}
      />
      
      {abilityList.length === 0 && (
        <div className="text-center py-20">
            <Text>Aucun talent trouvé</Text>
        </div>
      )}
    </div>
  );
}
