import { PokeAPI } from "@workspace/pokeapi";
import { Title } from "@/components/Title";
import { Text } from "@/components/Text";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Prevent static generation - fetch at runtime
export const dynamic = 'force-dynamic';

// Type definitions for Move API responses
interface Move {
  id: number;
  name: string;
  accuracy: number | null;
  effect_chance: number | null;
  pp: number;
  priority: number;
  power: number | null;
  type: { name: string; url: string };
  damage_class: { name: string; url: string };
  effect_entries: { effect: string; short_effect: string; language: { name: string } }[];
  flavor_text_entries: { flavor_text: string; language: { name: string }; version_group: { name: string } }[];
  learned_by_pokemon: { name: string; url: string }[];
  target: { name: string; url: string };
  contest_type: { name: string; url: string } | null;
  generation: { name: string; url: string };
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

// Damage class colors map
const damageClassColors: Record<string, string> = {
  physical: "bg-orange-500",
  special: "bg-blue-500",
  status: "bg-gray-500",
};

// Generate dynamic metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ name: string }> 
}): Promise<Metadata> {
  const { name } = await params;
  
  try {
    const move = await PokeAPI.move(name) as Move;
    const moveName = move.name.charAt(0).toUpperCase() + move.name.slice(1).replace(/-/g, ' ');
    
    let description = `Découvrez la capacité ${moveName}. Type: ${move.type.name}, Catégorie: ${move.damage_class.name}.`;
    
    if (move.power) {
      description += ` Puissance: ${move.power}.`;
    }
    
    return {
      title: `Capacité ${moveName} #${String(move.id).padStart(3, '0')}`,
      description,
      keywords: [
        move.name,
        'capacité',
        'move',
        'pokemon',
        move.type.name,
        move.damage_class.name,
      ],
      openGraph: {
        title: `Capacité ${moveName} #${String(move.id).padStart(3, '0')}`,
        description,
        type: 'website',
      },
    };
  } catch {
    return {
      title: 'Capacité non trouvée',
      description: 'Cette capacité n\'a pas été trouvée.',
    };
  }
}

export default async function MoveDetail({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  
  // Fetch Move data
  let move: Move;
  
  try {
    move = await PokeAPI.move(name) as Move;
  } catch {
    notFound();
  }

  // Get description from effect entries
  const description = move.effect_entries?.find(
    (e) => e.language.name === 'fr'
  )?.short_effect || move.effect_entries?.find(
    (e) => e.language.name === 'en'
  )?.short_effect || null;

  const fullEffect = move.effect_entries?.find(
    (e) => e.language.name === 'fr'
  )?.effect || move.effect_entries?.find(
    (e) => e.language.name === 'en'
  )?.effect || null;

  const flavorText = move.flavor_text_entries?.find(
    (e) => e.language.name === 'fr'
  )?.flavor_text || move.flavor_text_entries?.find(
    (e) => e.language.name === 'en'
  )?.flavor_text || null;

  const moveName = move.name.charAt(0).toUpperCase() + move.name.slice(1).replace(/-/g, ' ');

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="mb-6">
        <Link href="/pokemon/move">
          <Button variant="outline">← Retour aux Capacités</Button>
        </Link>
      </div>

      {/* Main info section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Left Column: Basic Info */}
        <div className="space-y-6">
          <Card className="overflow-hidden border-2">
            <div className="bg-muted/30 p-8 flex flex-col justify-center items-center aspect-square relative">
              <div className="text-8xl font-bold text-muted-foreground/20">
                #{String(move.id).padStart(3, '0')}
              </div>
              <div className="mt-4">
                <Badge 
                  className={`text-white px-6 py-2 text-lg capitalize ${typeColors[move.type.name] || 'bg-gray-500'}`}
                >
                  {move.type.name}
                </Badge>
              </div>
            </div>
          </Card>
          
          <div className="flex gap-2 justify-center flex-wrap">
            <Badge 
              className={`text-white px-4 py-1 text-base capitalize ${typeColors[move.type.name] || 'bg-gray-500'}`}
            >
              {move.type.name}
            </Badge>
            <Badge 
              className={`text-white px-4 py-1 text-base capitalize ${damageClassColors[move.damage_class.name] || 'bg-gray-500'}`}
            >
              {move.damage_class.name}
            </Badge>
          </div>
        </div>

        {/* Right Column: Stats & Details */}
        <div className="space-y-8">
          <div>
            <div className="flex items-baseline gap-4 flex-wrap">
              <Title level="h1" className="capitalize mb-2">{moveName}</Title>
              <span className="text-2xl text-muted-foreground font-mono">#{String(move.id).padStart(3, '0')}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Puissance</span>
                <span className="font-medium text-lg">{move.power ?? '-'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Précision</span>
                <span className="font-medium text-lg">{move.accuracy ? `${move.accuracy}%` : '-'}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">PP</span>
                <span className="font-medium text-lg">{move.pp}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Priorité</span>
                <span className="font-medium text-lg">{move.priority}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Cible</span>
                <span className="font-medium text-lg capitalize">{move.target.name.replace(/-/g, ' ')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Génération</span>
                <span className="font-medium text-lg capitalize">{move.generation.name.replace(/-/g, ' ')}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          {(description || flavorText) && (
            <div className="space-y-2">
              <Title level="h3">Description</Title>
              <Text className="text-muted-foreground leading-relaxed">
                {flavorText || description}
              </Text>
            </div>
          )}

          {/* Full Effect */}
          {fullEffect && (
            <div className="space-y-2">
              <Title level="h3">Effet</Title>
              <Text className="text-muted-foreground leading-relaxed">
                {fullEffect.replace('$effect_chance', String(move.effect_chance ?? ''))}
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <Card className="p-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle>Informations supplémentaires</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg text-center">
              <div className="text-2xl font-bold">{move.power ?? '-'}</div>
              <div className="text-sm text-muted-foreground">Puissance</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg text-center">
              <div className="text-2xl font-bold">{move.accuracy ? `${move.accuracy}%` : '-'}</div>
              <div className="text-sm text-muted-foreground">Précision</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg text-center">
              <div className="text-2xl font-bold">{move.pp}</div>
              <div className="text-sm text-muted-foreground">PP</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg text-center">
              <div className="text-2xl font-bold">{move.priority}</div>
              <div className="text-sm text-muted-foreground">Priorité</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg text-center">
              <div className="text-2xl font-bold capitalize">{move.damage_class.name}</div>
              <div className="text-sm text-muted-foreground">Catégorie</div>
            </div>
            {move.contest_type && (
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <div className="text-2xl font-bold capitalize">{move.contest_type.name}</div>
                <div className="text-sm text-muted-foreground">Concours</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pokémon that can learn this move */}
      {move.learned_by_pokemon && move.learned_by_pokemon.length > 0 && (
        <Card className="p-6 mt-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle>Pokémon pouvant apprendre cette capacité ({move.learned_by_pokemon.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {move.learned_by_pokemon.slice(0, 50).map((pokemon) => (
                <Link key={pokemon.name} href={`/pokemon/${pokemon.name}`}>
                  <Badge 
                    variant="outline" 
                    className="capitalize cursor-pointer hover:bg-muted"
                  >
                    {pokemon.name.replace(/-/g, ' ')}
                  </Badge>
                </Link>
              ))}
              {move.learned_by_pokemon.length > 50 && (
                <Badge variant="secondary">
                  +{move.learned_by_pokemon.length - 50} autres
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
