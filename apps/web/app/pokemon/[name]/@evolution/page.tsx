/**
 * Slot Évolution - Route Parallèle (@evolution)
 * 
 * Ce fichier fait partie des Routes Parallèles et affiche la chaîne d'évolution
 * d'un Pokémon. Il démontre le chargement de données imbriquées depuis une API externe.
 * 
 * Concepts clés pour les étudiants :
 * - Ce slot est rendu en parallèle avec les autres (@identity, @specs, @moves)
 * - Il a ses propres loading.tsx et error.tsx pour une gestion indépendante
 * - Le fetch de la chaîne d'évolution nécessite deux appels API en cascade
 */

import { PokeAPI } from "@workspace/pokeapi";
import { Card, CardHeader, CardTitle, CardContent } from "@workspace/ui/components/card";
import Link from "next/link";
import { PokemonImage } from "@/components/PokemonImage";

/**
 * Types pour les données de l'API PokeAPI
 */
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

/**
 * Fonction utilitaire pour extraire l'ID depuis une URL PokeAPI
 * Exemple : "https://pokeapi.co/api/v2/pokemon-species/25/" → "25"
 */
function getIdFromUrl(url: string): string {
    return url.split('/').filter(Boolean).pop() || '';
}

/**
 * Fonction récursive pour aplatir la chaîne d'évolution
 * L'API retourne une structure arborescente qu'on transforme en tableau linéaire
 * 
 * @param chain - Le nœud de départ de la chaîne d'évolution
 * @returns Tableau plat avec nom, id, niveau et méthode d'évolution
 */
function flattenEvolutionChain(chain: EvolutionLink): { name: string; id: string; level: number | null; trigger: string }[] {
    const result: { name: string; id: string; level: number | null; trigger: string }[] = [];

    // Fonction récursive interne pour parcourir l'arbre
    function traverse(link: EvolutionLink) {
        result.push({
            name: link.species.name,
            id: getIdFromUrl(link.species.url),
            level: link.evolution_details[0]?.min_level || null,
            trigger: link.evolution_details[0]?.trigger?.name || 'base',
        });
        // Parcours récursif des évolutions suivantes
        link.evolves_to.forEach(traverse);
    }

    traverse(chain);
    return result;
}

/**
 * Composant EvolutionPage - Affiche la chaîne d'évolution d'un Pokémon
 * 
 * Note : Retourne null si le Pokémon n'évolue pas (évolutions.length <= 1)
 * Cela permet une intégration propre dans le layout parent.
 */
export default async function EvolutionPage({ params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;

    let species: PokemonSpecies | null = null;
    let evolutionChain: EvolutionChain | null = null;

    // Récupération des données d'espèce pour obtenir l'URL de la chaîne d'évolution
    species = await PokeAPI.species(name) as PokemonSpecies;

    // Fetch de la chaîne d'évolution si disponible
    if (species?.evolution_chain?.url) {
        const res = await fetch(species.evolution_chain.url);
        if (res.ok) {
            evolutionChain = await res.json() as EvolutionChain;
        }
    }

    // Aplatissement de la chaîne d'évolution
    const evolutions = evolutionChain ? flattenEvolutionChain(evolutionChain.chain) : [];

    // Ne pas afficher si pas d'évolution (Pokémon qui n'évolue pas)
    if (evolutions.length <= 1) {
        return null;
    }

    return (
        <Card className="p-4 sm:p-6 mb-6 sm:mb-8">
            <CardHeader className="p-0 pb-3 sm:pb-4">
                <CardTitle className="text-base sm:text-lg">Chaîne d&apos;évolution</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                {/* Affichage horizontal des évolutions avec flèches */}
                <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4">
                    {evolutions.map((evo, index) => (
                        <div key={evo.name} className="flex items-center gap-2 sm:gap-4">
                            {/* Lien vers la page détail de chaque évolution */}
                            <Link href={`/pokemon/${evo.name}`} className="group">
                                <div className="flex flex-col items-center p-2 sm:p-4 rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="relative w-14 h-14 sm:w-20 sm:h-20 mb-1 sm:mb-2">
                                        <PokemonImage
                                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evo.id}.png`}
                                            alt={evo.name}
                                            fill
                                            className="object-contain group-hover:scale-110 transition-transform"
                                            style={{ imageRendering: 'pixelated' }}
                                        />
                                    </div>
                                    {/* Nom mis en évidence si c'est le Pokémon actuel */}
                                    <span className={`capitalize text-xs sm:text-sm font-medium ${evo.name === name ? 'text-primary' : ''}`}>
                                        {evo.name}
                                    </span>
                                    {/* Affichage du niveau d'évolution si applicable */}
                                    {evo.level && (
                                        <span className="text-[10px] sm:text-xs text-muted-foreground">Niv. {evo.level}</span>
                                    )}
                                </div>
                            </Link>
                            {/* Flèche entre les évolutions (sauf après la dernière) */}
                            {index < evolutions.length - 1 && (
                                <span className="text-lg sm:text-2xl text-muted-foreground">→</span>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
