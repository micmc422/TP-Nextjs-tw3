import { PokeAPI } from "@workspace/pokeapi";
import { PokemonSearch } from "@/components/PokemonSearch";
import { PokemonInfiniteList } from "@/components/PokemonInfiniteList";
import { Title } from "@/components/Title";
import { Text } from "@/components/Text";

export default async function PokemonPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
  }>;
}) {
  const { q } = await searchParams;
  const query = q || '';
  const limit = 20;

  let pokemonList = [];
  
  if (query) {
    // Search mode
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
        <PokemonSearch />
      </div>

      <PokemonInfiniteList 
        initialPokemon={pokemonList}
        initialOffset={limit}
        searchQuery={query || undefined}
      />
      
      {pokemonList.length === 0 && (
        <div className="text-center py-20">
            <Text>Aucun Pokémon trouvé pour &quot;{query}&quot;</Text>
        </div>
      )}
    </div>
  );
}
