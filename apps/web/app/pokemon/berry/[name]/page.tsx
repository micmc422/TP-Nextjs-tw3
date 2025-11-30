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

// Type definitions for Berry API responses
interface Berry {
  id: number;
  name: string;
  growth_time: number;
  max_harvest: number;
  natural_gift_power: number;
  size: number;
  smoothness: number;
  soil_dryness: number;
  firmness: { name: string; url: string };
  flavors: { potency: number; flavor: { name: string; url: string } }[];
  item: { name: string; url: string };
  natural_gift_type: { name: string; url: string } | null;
}

interface BerryItem {
  id: number;
  name: string;
  cost: number;
  effect_entries: { effect: string; short_effect: string; language: { name: string } }[];
  flavor_text_entries: { text: string; language: { name: string }; version_group: { name: string } }[];
  sprites: { default: string };
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

// Firmness colors map
const firmnessColors: Record<string, string> = {
  "very-soft": "bg-blue-200",
  "soft": "bg-green-200",
  "hard": "bg-yellow-200",
  "very-hard": "bg-orange-200",
  "super-hard": "bg-red-200",
};

// Flavor translations
const flavorTranslations: Record<string, string> = {
  spicy: "Épicé",
  dry: "Sec",
  sweet: "Sucré",
  bitter: "Amer",
  sour: "Acide",
};

// Generate dynamic metadata for SEO
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ name: string }> 
}): Promise<Metadata> {
  const { name } = await params;
  
  try {
    const berry = await PokeAPI.berry(name) as Berry;
    const berryName = berry.name.charAt(0).toUpperCase() + berry.name.slice(1);
    
    let description = `Découvrez la baie ${berryName}. Taille: ${berry.size}mm, Fermeté: ${berry.firmness.name}.`;
    
    if (berry.natural_gift_type) {
      description += ` Type de cadeau naturel: ${berry.natural_gift_type.name}.`;
    }
    
    const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${berry.name}-berry.png`;
    
    return {
      title: `Baie ${berryName} #${String(berry.id).padStart(3, '0')}`,
      description,
      keywords: [
        berry.name,
        'baie',
        'berry',
        'pokemon',
        berry.firmness.name,
        ...(berry.natural_gift_type ? [berry.natural_gift_type.name] : [])
      ],
      openGraph: {
        title: `Baie ${berryName} #${String(berry.id).padStart(3, '0')}`,
        description,
        images: [
          {
            url: imageUrl,
            width: 96,
            height: 96,
            alt: `Image de la baie ${berryName}`,
          }
        ],
        type: 'website',
      },
    };
  } catch {
    return {
      title: 'Baie non trouvée',
      description: 'Cette baie n\'a pas été trouvée.',
    };
  }
}

export default async function BerryDetail({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  
  // Fetch Berry data
  let berry: Berry;
  let berryItem: BerryItem | null = null;
  
  try {
    berry = await PokeAPI.berry(name) as Berry;
    
    // Try to fetch item info for description
    if (berry.item?.url) {
      try {
        const res = await fetch(berry.item.url);
        if (res.ok) {
          berryItem = await res.json() as BerryItem;
        }
      } catch {
        // Item info is optional
      }
    }
  } catch {
    notFound();
  }

  // Get description from item
  const description = berryItem?.effect_entries?.find(
    (e) => e.language.name === 'fr'
  )?.short_effect || berryItem?.effect_entries?.find(
    (e) => e.language.name === 'en'
  )?.short_effect || null;

  const flavorText = berryItem?.flavor_text_entries?.find(
    (e) => e.language.name === 'fr'
  )?.text || berryItem?.flavor_text_entries?.find(
    (e) => e.language.name === 'en'
  )?.text || null;

  const berryName = berry.name.charAt(0).toUpperCase() + berry.name.slice(1);
  const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${berry.name}-berry.png`;

  // Sort flavors by potency
  const sortedFlavors = [...berry.flavors].sort((a, b) => b.potency - a.potency);
  const maxPotency = Math.max(...berry.flavors.map(f => f.potency), 1);

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <div className="mb-6">
        <Link href="/pokemon/berry">
          <Button variant="outline">← Retour aux Baies</Button>
        </Link>
      </div>

      {/* Main info section */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Left Column: Image & Basic Info */}
        <div className="space-y-6">
          <Card className="overflow-hidden border-2">
            <div className="bg-muted/30 p-8 flex justify-center items-center aspect-square relative">
              <Image 
                src={imageUrl} 
                alt={berry.name}
                width={192}
                height={192}
                className="object-contain drop-shadow-xl"
                priority
              />
            </div>
          </Card>
          
          <div className="flex gap-2 justify-center flex-wrap">
            {berry.natural_gift_type && (
              <Badge 
                className={`text-white px-4 py-1 text-base capitalize ${typeColors[berry.natural_gift_type.name] || 'bg-gray-500'}`}
              >
                {berry.natural_gift_type.name}
              </Badge>
            )}
            <Badge 
              variant="outline"
              className={`px-4 py-1 text-base capitalize ${firmnessColors[berry.firmness.name] || ''}`}
            >
              {berry.firmness.name.replace('-', ' ')}
            </Badge>
          </div>
        </div>

        {/* Right Column: Stats & Details */}
        <div className="space-y-8">
          <div>
            <div className="flex items-baseline gap-4 flex-wrap">
              <Title level="h1" className="capitalize mb-2">Baie {berryName}</Title>
              <span className="text-2xl text-muted-foreground font-mono">#{String(berry.id).padStart(3, '0')}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
              <div className="flex flex-col">
                <span className="text-muted-foreground">Taille</span>
                <span className="font-medium text-lg">{berry.size} mm</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Douceur</span>
                <span className="font-medium text-lg">{berry.smoothness}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Temps de croissance</span>
                <span className="font-medium text-lg">{berry.growth_time}h</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Récolte max</span>
                <span className="font-medium text-lg">{berry.max_harvest}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-muted-foreground">Sécheresse du sol</span>
                <span className="font-medium text-lg">{berry.soil_dryness}</span>
              </div>
              {berry.natural_gift_power > 0 && (
                <div className="flex flex-col">
                  <span className="text-muted-foreground">Puissance Cadeau</span>
                  <span className="font-medium text-lg">{berry.natural_gift_power}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {(description || flavorText) && (
            <div className="space-y-2">
              <Title level="h3">Description</Title>
              <Text className="text-muted-foreground leading-relaxed">
                {description || flavorText}
              </Text>
            </div>
          )}
        </div>
      </div>

      {/* Flavors */}
      <Card className="p-6 mb-8">
        <CardHeader className="p-0 pb-4">
          <CardTitle>Saveurs</CardTitle>
          <Text className="text-sm text-muted-foreground">Intensité des différentes saveurs de cette baie</Text>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-4">
            {sortedFlavors.map((f) => (
              <div key={f.flavor.name} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="capitalize font-medium">
                    {flavorTranslations[f.flavor.name] || f.flavor.name}
                  </span>
                  <span className="text-muted-foreground">{f.potency}</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${(f.potency / maxPotency) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Additional Info */}
      <Card className="p-6">
        <CardHeader className="p-0 pb-4">
          <CardTitle>Informations supplémentaires</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg text-center">
              <div className="text-2xl font-bold">{berry.growth_time}h</div>
              <div className="text-sm text-muted-foreground">Croissance</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg text-center">
              <div className="text-2xl font-bold">{berry.max_harvest}</div>
              <div className="text-sm text-muted-foreground">Récolte max</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg text-center">
              <div className="text-2xl font-bold">{berry.size}mm</div>
              <div className="text-sm text-muted-foreground">Taille</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg text-center">
              <div className="text-2xl font-bold">{berry.smoothness}</div>
              <div className="text-sm text-muted-foreground">Douceur</div>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg text-center">
              <div className="text-2xl font-bold capitalize">{berry.firmness.name.replace('-', ' ')}</div>
              <div className="text-sm text-muted-foreground">Fermeté</div>
            </div>
            {berry.natural_gift_power > 0 && (
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <div className="text-2xl font-bold">{berry.natural_gift_power}</div>
                <div className="text-sm text-muted-foreground">Puissance</div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
