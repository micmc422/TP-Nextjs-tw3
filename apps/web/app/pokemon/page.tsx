import type { Metadata } from "next";
import { PokeAPI } from "@workspace/pokeapi";
import { PokemonSearch } from "@/components/PokemonSearch";
import { PokemonFilters } from "@/components/PokemonFilters";
import { PokemonInfiniteList } from "@/components/PokemonInfiniteList";
import { Title } from "@/components/Title";
import { Text } from "@/components/Text";

export const metadata: Metadata = {
  title: "Pokédex",
  description: "Explorez le monde des Pokémon via notre Pokédex intégré. Recherchez par nom et découvrez les détails de chaque Pokémon.",
  keywords: ["Pokémon", "Pokédex", "recherche", "liste"],
  openGraph: {
    title: "Pokédex | Next.js Avancé",
    description: "Explorez le monde des Pokémon via notre Pokédex intégré.",
  },
};

export default async function PokemonPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
    type?: string;
  }>;
}) {
  const { q, type } = await searchParams;
  const query = q || '';
  const typeFilter = type || '';
  const limit = 20;

  let pokemonList = [];
  
  if (typeFilter) {
    // Filter by type mode
    let typePokemon = await PokeAPI.getPokemonByType(typeFilter);
    // Also apply search filter if provided
    if (query) {
      const q = query.toLowerCase();
      typePokemon = typePokemon.filter((p) => p.name.includes(q));
    }
    pokemonList = typePokemon;
  } else if (query) {
    // Search mode only
    pokemonList = await PokeAPI.searchPokemonByName(query);
  } else {
    // Initial load for infinite scroll
    const data = await PokeAPI.listPokemon(limit, 0);
    pokemonList = data.results;
  }

  return (
    <div className="container mx-auto py-10 px-4 space-y-8">
      <div className="flex flex-col items-center text-center space-y-4">
        <Title level="h1">Pokédex</Title>
        <Text size="lg" className="max-w-2xl">
          Explorez le monde des Pokémon via notre API intégrée. 
          Utilisez la recherche pour filtrer par nom, ou faites défiler pour découvrir plus de Pokémon !
        </Text>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-2xl justify-center items-start">
          <PokemonSearch />
          <PokemonFilters />
        </div>
      </div>

      <PokemonInfiniteList 
        initialPokemon={pokemonList}
        initialOffset={limit}
        searchQuery={query || undefined}
        typeFilter={typeFilter || undefined}
      />
      
      {pokemonList.length === 0 && (
        <div className="text-center py-20">
            <Text>
              Aucun Pokémon trouvé
              {query && ` pour "${query}"`}
              {typeFilter && ` de type "${typeFilter}"`}
            </Text>
        </div>
      )}
    </div>
  );
}
