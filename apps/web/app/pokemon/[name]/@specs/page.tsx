import { PokeAPI } from "@workspace/pokeapi";
import { Title } from "@/components/Title";
import { Text } from "@/components/Text";
import { PokemonStats } from "@/components/PokemonStats";
import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";
import { notFound } from "next/navigation";

// Type definitions
interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  stats: { stat: { name: string }; base_stat: number }[];
  abilities: { ability: { name: string }; is_hidden: boolean }[];
}

interface PokemonSpecies {
  flavor_text_entries: { flavor_text: string; language: { name: string }; version: { name: string } }[];
  genera: { genus: string; language: { name: string } }[];
  habitat: { name: string } | null;
  is_legendary: boolean;
  is_mythical: boolean;
  capture_rate: number;
}

export default async function SpecsPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;

  const pokemon = await PokeAPI.pokemon(name) as Pokemon;
  let species: PokemonSpecies | null = null;

  try {
    species = await PokeAPI.species(name) as PokemonSpecies;
  } catch(e) {
    // throw new Error('Échec de la récupération des données d\'espèce');
  }

  // Get French description or fall back to English
  const description = species?.flavor_text_entries?.find(
    (e) => e.language.name === 'fr'
  )?.flavor_text || species?.flavor_text_entries?.find(
    (e) => e.language.name === 'en'
  )?.flavor_text || null;

  // Get genus (category)
  const genus = species?.genera?.find(
    (g) => g.language.name === 'fr'
  )?.genus || species?.genera?.find(
    (g) => g.language.name === 'en'
  )?.genus || null;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-baseline gap-4 flex-wrap">
          <Title level="h1" className="capitalize mb-2">{pokemon.name}</Title>
          <span className="text-2xl text-muted-foreground font-mono">#{String(pokemon.id).padStart(3, '0')}</span>
          {species?.is_legendary && (
            <Badge className="bg-amber-500 text-white">Légendaire</Badge>
          )}
          {species?.is_mythical && (
            <Badge className="bg-purple-600 text-white">Mythique</Badge>
          )}
        </div>
        {genus && (
          <Text className="text-muted-foreground italic">{genus}</Text>
        )}

        <div className="flex gap-8 mt-4 text-sm flex-wrap">
          <div className="flex flex-col">
            <span className="text-muted-foreground">Taille</span>
            <span className="font-medium text-lg">{pokemon.height / 10} m</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground">Poids</span>
            <span className="font-medium text-lg">{pokemon.weight / 10} kg</span>
          </div>
          {species?.habitat && (
            <div className="flex flex-col">
              <span className="text-muted-foreground">Habitat</span>
              <span className="font-medium text-lg capitalize">{species.habitat.name}</span>
            </div>
          )}
          {species?.capture_rate && (
            <div className="flex flex-col">
              <span className="text-muted-foreground">Taux de capture</span>
              <span className="font-medium text-lg">{species.capture_rate}</span>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="space-y-2">
          <Title level="h3">Description</Title>
          <Text className="text-muted-foreground leading-relaxed">
            {description.replace(/\f/g, ' ').replace(/\n/g, ' ')}
          </Text>
        </div>
      )}

      {/* Stats */}
      <div className="space-y-4">
        <PokemonStats stats={pokemon.stats} />
      </div>

      {/* Abilities */}
      <div className="space-y-4">
        <Title level="h3">Talents (Abilities)</Title>
        <div className="flex flex-wrap gap-2">
          {pokemon.abilities.map((a) => (
            <Link key={a.ability.name} href={`/pokemon/ability/${a.ability.name}`}>
              <Badge variant="secondary" className="capitalize cursor-pointer hover:bg-muted">
                {a.ability.name.replace('-', ' ')}
                {a.is_hidden && <span className="ml-1 text-xs opacity-50">(Caché)</span>}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
