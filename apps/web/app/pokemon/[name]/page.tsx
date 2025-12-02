import { PokeAPI } from "@workspace/pokeapi";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PokemonDetailHeader } from "@/components/PokemonDetailHeader";

// Type definitions for PokeAPI responses
interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { type: { name: string } }[];
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  sprites: {
    front_default: string;
    other: { 'official-artwork': { front_default: string; front_shiny: string } };
  };
}

interface PokemonSpecies {
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
}

// Generate dynamic metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ name: string }>
}): Promise<Metadata> {
  const { name } = await params;

  try {
    const pokemon = await PokeAPI.pokemon(name) as Pokemon;
    // Try to get species info for description
    let description = `Découvrez ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}, un Pokémon de type ${pokemon.types.map(t => t.type.name).join('/')}. Taille: ${pokemon.height / 10}m, Poids: ${pokemon.weight / 10}kg.`;

    try {
      const species = await PokeAPI.species(name) as PokemonSpecies;
      const frenchEntry = species?.flavor_text_entries?.find(
        (e) => e.language.name === 'fr'
      )?.flavor_text;
      const englishEntry = species?.flavor_text_entries?.find(
        (e) => e.language.name === 'en'
      )?.flavor_text;

      if (frenchEntry || englishEntry) {
        description = (frenchEntry || englishEntry || '').replace(/\f/g, ' ').replace(/\n/g, ' ');
      }
    } catch {
      notFound();
    }

    const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const imageUrl = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

    return {
      title: `${pokemonName} #${String(pokemon.id).padStart(3, '0')} | Pokédex`,
      description,
      keywords: [
        pokemon.name,
        ...pokemon.types.map(t => t.type.name),
        'pokemon',
        'pokédex',
        ...pokemon.abilities.map(a => a.ability.name)
      ],
      openGraph: {
        title: `${pokemonName} #${String(pokemon.id).padStart(3, '0')} | Pokédex`,
        description,
        images: imageUrl ? [
          {
            url: imageUrl,
            width: 475,
            height: 475,
            alt: `Image de ${pokemonName}`,
          }
        ] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: `${pokemonName} #${String(pokemon.id).padStart(3, '0')} | Pokédex`,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch {
    return {
      title: 'Pokémon non trouvé | Pokédex',
      description: 'Ce Pokémon n\'a pas été trouvé dans le Pokédex.',
    };
  }
}

export default async function PokemonDetail({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;

  let pokemon: Pokemon;
  try {
    // Check if pokemon exists
    pokemon = await PokeAPI.pokemon(name) as Pokemon;
  } catch {
    notFound();
  }

  return <PokemonDetailHeader pokemonId={pokemon.id} pokemonName={pokemon.name} />;
}
