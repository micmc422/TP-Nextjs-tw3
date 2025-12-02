import { PokeAPI } from "@workspace/pokeapi";
import { Badge } from "@workspace/ui/components/badge";
import { Card, CardTitle } from "@workspace/ui/components/card";
import { PokemonImage } from "@/components/PokemonImage";
import { notFound } from "next/navigation";

// Type definitions
interface Pokemon {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  sprites: {
    front_default: string;
    front_shiny: string;
    other: { 'official-artwork': { front_default: string; front_shiny: string } };
  };
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

export default async function IdentityPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;

  const pokemon = await PokeAPI.pokemon(name) as Pokemon;

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-2">
        <div className="bg-muted/30 p-8 flex justify-center items-center aspect-square relative">
          <PokemonImage
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
              <PokemonImage
                src={pokemon.sprites.front_shiny}
                alt={`${pokemon.name} shiny`}
                fill
                className="object-contain"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
            {pokemon.sprites.other['official-artwork'].front_shiny && (
              <div className="relative w-24 h-24">
                <PokemonImage
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
  );
}
