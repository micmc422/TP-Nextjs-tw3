import { PokeAPI } from "@workspace/pokeapi";
import { Title } from "@/components/Title";
import { Text } from "@/components/Text";
import { PokemonStats } from "@/components/PokemonStats";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Type definitions for PokeAPI responses
interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: { type: { name: string } }[];
  stats: { stat: { name: string }; base_stat: number }[];
  abilities: { ability: { name: string }; is_hidden: boolean }[];
  moves: { move: { name: string } }[];
  game_indices: { version: { name: string } }[];
  sprites: {
    front_default: string;
    front_shiny: string;
    other: { 'official-artwork': { front_default: string; front_shiny: string } };
  };
}

interface PokemonSpecies {
  flavor_text_entries: { flavor_text: string; language: { name: string }; version: { name: string } }[];
  genera: { genus: string; language: { name: string } }[];
  evolution_chain: { url: string };
  habitat: { name: string } | null;
  generation: { name: string };
  is_legendary: boolean;
  is_mythical: boolean;
  capture_rate: number;
  base_happiness: number;
  growth_rate: { name: string };
}

interface EvolutionChain {
  chain: EvolutionLink;
}

interface EvolutionLink {
  species: { name: string; url: string };
  evolution_details: { min_level: number | null; trigger: { name: string }; item: { name: string } | null }[];
  evolves_to: EvolutionLink[];
}

// Helper to get ID from URL
function getIdFromUrl(url: string): string {
  return url.split('/').filter(Boolean).pop() || '';
}

// Flatten evolution chain
function flattenEvolutionChain(chain: EvolutionLink): { name: string; id: string; level: number | null; trigger: string }[] {
  const result: { name: string; id: string; level: number | null; trigger: string }[] = [];

  function traverse(link: EvolutionLink) {
    result.push({
      name: link.species.name,
      id: getIdFromUrl(link.species.url),
      level: link.evolution_details[0]?.min_level || null,
      trigger: link.evolution_details[0]?.trigger?.name || 'base',
    });
    link.evolves_to.forEach(traverse);
  }

  traverse(chain);
  return result;
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
      // Species info is optional
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

  // Fetch Pokemon data
  let pokemon: Pokemon;
  let species: PokemonSpecies | null = null;
  let evolutionChain: EvolutionChain | null = null;

  try {
    pokemon = await PokeAPI.pokemon(name) as Pokemon;

    // Try to fetch species info
    try {
      species = await PokeAPI.species(name) as PokemonSpecies;

      // Try to fetch evolution chain
      if (species?.evolution_chain?.url) {
        const res = await fetch(species.evolution_chain.url);
        if (res.ok) {
          evolutionChain = await res.json() as EvolutionChain;
        }
      }
    } catch {
      // Species info is optional
    }
  } catch {
    notFound();
  }

  // Type colors map
  const typeColors: Record<string, string> = {
    fire: "bg-red-500 hover:bg-red-600",
    water: "bg-blue-500 hover:bg-blue-600",
    grass: "bg-green-500 hover:bg-green-600",
    electric: "bg-yellow-500 hover:bg-yellow-600",
    psychic: "bg-pink-500 hover:bg-pink-600",
    ice: "bg-cyan-500 hover:bg-cyan-600",
    dragon: "bg-indigo-500 hover:bg-indigo-600",
    dark: "bg-slate-800 hover:bg-slate-900",
    fairy: "bg-rose-400 hover:bg-rose-500",
    normal: "bg-gray-400 hover:bg-gray-500",
    fighting: "bg-orange-700 hover:bg-orange-800",
    flying: "bg-sky-400 hover:bg-sky-500",
    poison: "bg-purple-500 hover:bg-purple-600",
    ground: "bg-amber-600 hover:bg-amber-700",
    rock: "bg-stone-500 hover:bg-stone-600",
    bug: "bg-lime-500 hover:bg-lime-600",
    ghost: "bg-violet-700 hover:bg-violet-800",
    steel: "bg-slate-400 hover:bg-slate-500",
  };

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

  // Get evolution chain
  const evolutions = evolutionChain ? flattenEvolutionChain(evolutionChain.chain) : [];

  // Get some notable moves (limit to 12)
  const moves = pokemon.moves.slice(0, 12);

  // Get game versions where this Pokemon appears
  const gameIndices = pokemon.game_indices;

  return (
    <div className="container mx-auto py-10 px-4 max-w-6xl">
      <div className="mb-6">
        <Link href="/pokemon">
          <Button variant="outline">← Retour au Pokédex</Button>
        </Link>
      </div>

      {/* Main info section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Left Column: Image & Basic Info */}
        <div className="space-y-6">
          <Card className="overflow-hidden border-2">
            <div className="bg-muted/30 p-8 flex justify-center items-center aspect-square relative">
              <Image
                src={pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}
                alt={pokemon.name}
                fill
                className="object-contain p-4 drop-shadow-xl"
                priority
              />
            </div>
          </Card>

          <div className="flex gap-2 justify-center">
            {pokemon.types.map((t) => (
              <Badge
                key={t.type.name}
                className={`text-white px-4 py-1 text-base capitalize ${typeColors[t.type.name] || 'bg-gray-500'}`}
              >
                {t.type.name}
              </Badge>
            ))}
          </div>

          {/* Shiny variant */}
          {pokemon.sprites.front_shiny && (
            <Card className="p-4">
              <CardTitle className="text-sm text-center mb-3 text-muted-foreground">Variante Chromatique (Shiny)</CardTitle>
              <div className="flex justify-center gap-4">
                <div className="relative w-24 h-24">
                  <Image
                    src={pokemon.sprites.front_shiny}
                    alt={`${pokemon.name} shiny`}
                    fill
                    className="object-contain"
                    style={{ imageRendering: 'pixelated' }}

                  />
                </div>
                {pokemon.sprites.other['official-artwork'].front_shiny && (
                  <div className="relative w-24 h-24">
                    <Image
                      src={pokemon.sprites.other['official-artwork'].front_shiny}
                      alt={`${pokemon.name} shiny artwork`}
                      fill
                      className="object-contain"
                    />
                  </div>
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Right Column: Stats & Details */}
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
      </div>

      {/* Evolution Chain */}
      {evolutions.length > 1 && (
        <Card className="p-6 mb-8">
          <CardHeader className="p-0 pb-4">
            <CardTitle>Chaîne d&apos;évolution</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-wrap items-center justify-center gap-4">
              {evolutions.map((evo, index) => (
                <div key={evo.name} className="flex items-center gap-4">
                  <Link href={`/pokemon/${evo.name}`} className="group">
                    <div className="flex flex-col items-center p-4 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="relative w-20 h-20 mb-2">
                        <Image
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`}
                          alt={evo.name}
                          fill
                          className="object-contain group-hover:scale-110 transition-transform"
                          style={{ imageRendering: 'pixelated' }}
                        />
                      </div>
                      <span className={`capitalize text-sm font-medium ${evo.name === name ? 'text-primary' : ''}`}>
                        {evo.name}
                      </span>
                      {evo.level && (
                        <span className="text-xs text-muted-foreground">Niv. {evo.level}</span>
                      )}
                    </div>
                  </Link>
                  {index < evolutions.length - 1 && (
                    <span className="text-2xl text-muted-foreground">→</span>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Moves */}
      {moves.length > 0 && (
        <Card className="p-6 mb-8">
          <CardHeader className="p-0 pb-4">
            <CardTitle>Capacités (Moves)</CardTitle>
            <Text className="text-sm text-muted-foreground">Quelques capacités que ce Pokémon peut apprendre</Text>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-wrap gap-2">
              {moves.map((m) => (
                <Link key={m.move.name} href={`/pokemon/move/${m.move.name}`}>
                  <Badge variant="outline" className="capitalize cursor-pointer hover:bg-muted">
                    {m.move.name.replace('-', ' ')}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Game Appearances */}
      {gameIndices.length > 0 && (
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle>Apparitions dans les jeux</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-wrap gap-2">
              {gameIndices.map((g) => (
                <Badge key={g.version.name} variant="secondary" className="capitalize">
                  {g.version.name.replace('-', ' ')}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
