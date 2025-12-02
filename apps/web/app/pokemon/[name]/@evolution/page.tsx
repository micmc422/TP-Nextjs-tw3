import { PokeAPI } from "@workspace/pokeapi";
import { Card, CardHeader, CardTitle, CardContent } from "@workspace/ui/components/card";
import Link from "next/link";
import { PokemonImage } from "@/components/PokemonImage";
import { notFound } from "next/navigation";

// Type definitions
interface PokemonSpecies {
    evolution_chain: { url: string };
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

export default async function EvolutionPage({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;

    let species: PokemonSpecies | null = null;
    let evolutionChain: EvolutionChain | null = null;

    species = await PokeAPI.species(name) as PokemonSpecies;

    if (species?.evolution_chain?.url) {
        const res = await fetch(species.evolution_chain.url);
        if (res.ok) {
            evolutionChain = await res.json() as EvolutionChain;
        }
    }

    const evolutions = evolutionChain ? flattenEvolutionChain(evolutionChain.chain) : [];

    if (evolutions.length <= 1) {
        return null;
    }

    return (
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
                                        <PokemonImage
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
    );
}
