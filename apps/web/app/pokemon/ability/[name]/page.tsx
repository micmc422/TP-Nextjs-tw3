import { PokeAPI } from "@workspace/pokeapi";
import { Title } from "@/components/Title";
import { Text } from "@/components/Text";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

// Prevent static generation - fetch at runtime
export const dynamic = 'force-dynamic';

// Type definitions for Ability API responses
interface Ability {
  id: number;
  name: string;
  is_main_series: boolean;
  generation: { name: string; url: string };
  effect_entries: { effect: string; short_effect: string; language: { name: string } }[];
  flavor_text_entries: { flavor_text: string; language: { name: string }; version_group: { name: string } }[];
  pokemon: { is_hidden: boolean; slot: number; pokemon: { name: string; url: string } }[];
}

// Maximum number of Pokemon to display per category
const MAX_POKEMON_DISPLAY = 30;

// Helper to get ID from URL
function getIdFromUrl(url: string): string {
  return url.split('/').filter(Boolean).pop() || '';
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ name: string }> 
}): Promise<Metadata> {
  const { name } = await params;
  
  try {
    const ability = await PokeAPI.ability(name) as Ability;
    const abilityName = ability.name.charAt(0).toUpperCase() + ability.name.slice(1).replace(/-/g, ' ');
    
    const description = ability.effect_entries?.find(
      (e) => e.language.name === 'fr'
    )?.short_effect || ability.effect_entries?.find(
      (e) => e.language.name === 'en'
    )?.short_effect || `Découvrez le talent ${abilityName} et les Pokémon qui le possèdent.`;
    
    return {
      title: `Talent ${abilityName} #${String(ability.id).padStart(3, '0')}`,
      description,
      keywords: [
        ability.name,
        'talent',
        'ability',
        'pokemon',
        ability.generation.name,
      ],
      openGraph: {
        title: `Talent ${abilityName} #${String(ability.id).padStart(3, '0')}`,
        description,
        type: 'website',
      },
    };
  } catch {
    return {
      title: 'Talent non trouvé',
      description: 'Ce talent n\'a pas été trouvé.',
    };
  }
}

export default async function AbilityDetail({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  
  // Fetch Ability data
  let ability: Ability;
  
  try {
    ability = await PokeAPI.ability(name) as Ability;
  } catch {
    notFound();
  }

  // Get description from effect entries
  const shortEffect = ability.effect_entries?.find(
    (e) => e.language.name === 'fr'
  )?.short_effect || ability.effect_entries?.find(
    (e) => e.language.name === 'en'
  )?.short_effect || null;

  const fullEffect = ability.effect_entries?.find(
    (e) => e.language.name === 'fr'
  )?.effect || ability.effect_entries?.find(
    (e) => e.language.name === 'en'
  )?.effect || null;

  const flavorText = ability.flavor_text_entries?.find(
    (e) => e.language.name === 'fr'
  )?.flavor_text || ability.flavor_text_entries?.find(
    (e) => e.language.name === 'en'
  )?.flavor_text || null;

  const abilityName = ability.name.charAt(0).toUpperCase() + ability.name.slice(1).replace(/-/g, ' ');

  // Separate regular and hidden ability Pokemon
  const regularPokemon = ability.pokemon.filter(p => !p.is_hidden);
  const hiddenPokemon = ability.pokemon.filter(p => p.is_hidden);

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="mb-6">
        <Link href="/pokemon/ability">
          <Button variant="outline">← Retour aux Talents</Button>
        </Link>
      </div>

      {/* Main info section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Left Column: Basic Info */}
        <div className="space-y-6">
          <Card className="overflow-hidden border-2">
            <div className="bg-muted/30 p-8 flex flex-col justify-center items-center aspect-square relative">
              <div className="text-8xl font-bold text-muted-foreground/20">
                #{String(ability.id).padStart(3, '0')}
              </div>
              <div className="mt-4">
                <Badge 
                  className="text-white px-6 py-2 text-lg capitalize bg-purple-600"
                >
                  Talent
                </Badge>
              </div>
            </div>
          </Card>
          
          <div className="flex gap-2 justify-center flex-wrap">
            <Badge 
              variant="outline"
              className="px-4 py-1 text-base capitalize"
            >
              {ability.generation.name.replace(/-/g, ' ')}
            </Badge>
            {ability.is_main_series && (
              <Badge 
                variant="secondary"
                className="px-4 py-1 text-base"
              >
                Série principale
              </Badge>
            )}
          </div>
        </div>

        {/* Right Column: Stats & Details */}
        <div className="space-y-8">
          <div>
            <div className="flex items-baseline gap-4 flex-wrap">
              <Title level="h1" className="capitalize mb-2">{abilityName}</Title>
              <span className="text-2xl text-muted-foreground font-mono">#{String(ability.id).padStart(3, '0')}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Génération</span>
                <span className="font-medium text-lg capitalize">{ability.generation.name.replace(/-/g, ' ')}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Pokémon avec ce talent</span>
                <span className="font-medium text-lg">{ability.pokemon.length}</span>
              </div>
            </div>
          </div>

          {/* Short Effect */}
          {shortEffect && (
            <div className="space-y-2">
              <Title level="h3">Effet</Title>
              <Text className="text-muted-foreground leading-relaxed">
                {shortEffect}
              </Text>
            </div>
          )}

          {/* Flavor Text */}
          {flavorText && (
            <div className="space-y-2">
              <Title level="h3">Description</Title>
              <Text className="text-muted-foreground leading-relaxed">
                {flavorText.replace(/\n/g, ' ')}
              </Text>
            </div>
          )}

          {/* Full Effect */}
          {fullEffect && fullEffect !== shortEffect && (
            <div className="space-y-2">
              <Title level="h3">Détails</Title>
              <Text className="text-muted-foreground leading-relaxed text-sm">
                {fullEffect}
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Additional Info */}
      <Card className="p-6 mb-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle>Informations supplémentaires</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg text-center">
              <div className="text-2xl font-bold">{ability.pokemon.length}</div>
              <div className="text-sm text-muted-foreground">Pokémon total</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg text-center">
              <div className="text-2xl font-bold">{regularPokemon.length}</div>
              <div className="text-sm text-muted-foreground">Talent régulier</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg text-center">
              <div className="text-2xl font-bold">{hiddenPokemon.length}</div>
              <div className="text-sm text-muted-foreground">Talent caché</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pokémon with this ability */}
      {ability.pokemon && ability.pokemon.length > 0 && (
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle>Pokémon avec ce talent ({ability.pokemon.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0 space-y-6">
            {/* Regular Pokemon */}
            {regularPokemon.length > 0 && (
              <div>
                <Text className="text-sm text-muted-foreground mb-3">Talent régulier</Text>
                <div className="flex flex-wrap gap-3">
                  {regularPokemon.slice(0, MAX_POKEMON_DISPLAY).map((p) => {
                    const pokemonId = getIdFromUrl(p.pokemon.url);
                    return (
                      <Link key={p.pokemon.name} href={`/pokemon/${p.pokemon.name}`}>
                        <div className="flex flex-col items-center p-2 rounded-lg hover:bg-muted/50 transition-colors group">
                          <div className="relative w-12 h-12">
                            <Image
                              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                              alt={p.pokemon.name}
                              fill
                              className="object-contain group-hover:scale-110 transition-transform"
                              style={{ imageRendering: 'pixelated' }}
                            />
                          </div>
                          <span className="text-xs capitalize text-center">
                            {p.pokemon.name.replace(/-/g, ' ')}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                  {regularPokemon.length > MAX_POKEMON_DISPLAY && (
                    <div className="flex items-center justify-center p-4">
                      <Badge variant="secondary">
                        +{regularPokemon.length - MAX_POKEMON_DISPLAY} autres
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Hidden Pokemon */}
            {hiddenPokemon.length > 0 && (
              <div>
                <Text className="text-sm text-muted-foreground mb-3">Talent caché</Text>
                <div className="flex flex-wrap gap-3">
                  {hiddenPokemon.slice(0, MAX_POKEMON_DISPLAY).map((p) => {
                    const pokemonId = getIdFromUrl(p.pokemon.url);
                    return (
                      <Link key={p.pokemon.name} href={`/pokemon/${p.pokemon.name}`}>
                        <div className="flex flex-col items-center p-2 rounded-lg hover:bg-muted/50 transition-colors group">
                          <div className="relative w-12 h-12">
                            <Image
                              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                              alt={p.pokemon.name}
                              fill
                              className="object-contain group-hover:scale-110 transition-transform"
                              style={{ imageRendering: 'pixelated' }}
                            />
                          </div>
                          <span className="text-xs capitalize text-center">
                            {p.pokemon.name.replace(/-/g, ' ')}
                          </span>
                          <Badge variant="outline" className="text-[10px] mt-1">Caché</Badge>
                        </div>
                      </Link>
                    );
                  })}
                  {hiddenPokemon.length > MAX_POKEMON_DISPLAY && (
                    <div className="flex items-center justify-center p-4">
                      <Badge variant="secondary">
                        +{hiddenPokemon.length - MAX_POKEMON_DISPLAY} autres
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
