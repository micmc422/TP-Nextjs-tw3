/**
 * Page Détail Pokémon - Route Dynamique
 * 
 * Ce fichier illustre les Routes Dynamiques et la génération de métadonnées dynamiques
 * dans Next.js App Router.
 * 
 * Concepts clés pour les étudiants :
 * - Le dossier [name] crée une route dynamique capturant le paramètre "name"
 * - generateMetadata permet de créer des métadonnées SEO basées sur les données
 * - La fonction notFound() déclenche l'affichage de not-found.tsx
 * - Les params sont une Promise dans Next.js 15+ (async patterns)
 * 
 * URL exemple : /pokemon/pikachu → params.name = "pikachu"
 */

import { PokeAPI } from "@workspace/pokeapi";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PokemonDetailHeader } from "@/components/PokemonDetailHeader";

/**
 * Définitions de types pour les réponses de l'API Pokémon
 * TypeScript aide à garantir la cohérence des données
 */
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

/**
 * Génération des Métadonnées Dynamiques pour le SEO
 * 
 * Cette fonction est appelée par Next.js au moment du rendu pour
 * générer les balises meta appropriées pour chaque Pokémon.
 * 
 * @param params - Contient le paramètre de route (name du Pokémon)
 * @returns Métadonnées pour le SEO et le partage social
 */
export async function generateMetadata({
  params
}: {
  params: Promise<{ name: string }>
}): Promise<Metadata> {
  const { name } = await params;

  try {
    // Récupération des données du Pokémon pour les métadonnées
    const pokemon = await PokeAPI.pokemon(name) as Pokemon;
    // Construction d'une description par défaut
    let description = `Découvrez ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}, un Pokémon de type ${pokemon.types.map(t => t.type.name).join('/')}. Taille: ${pokemon.height / 10}m, Poids: ${pokemon.weight / 10}kg.`;

    try {
      // Tentative de récupération de la description localisée
      const species = await PokeAPI.species(name) as PokemonSpecies;
      // Priorité au français, fallback à l'anglais
      const frenchEntry = species?.flavor_text_entries?.find(
        (e) => e.language.name === 'fr'
      )?.flavor_text;
      const englishEntry = species?.flavor_text_entries?.find(
        (e) => e.language.name === 'en'
      )?.flavor_text;

      if (frenchEntry || englishEntry) {
        // Nettoyage des caractères spéciaux de la description
        description = (frenchEntry || englishEntry || '').replace(/\f/g, ' ').replace(/\n/g, ' ');
      }
    } catch {
      // Si l'espèce n'existe pas, afficher la page 404
      notFound();
    }

    // Formatage du nom avec majuscule
    const pokemonName = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
    const imageUrl = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;

    return {
      title: `${pokemonName} #${String(pokemon.id).padStart(3, '0')} | Pokédex`,
      description,
      // Mots-clés pour le SEO
      keywords: [
        pokemon.name,
        ...pokemon.types.map(t => t.type.name),
        'pokemon',
        'pokédex',
        ...pokemon.abilities.map(a => a.ability.name)
      ],
      // Métadonnées Open Graph pour le partage sur les réseaux sociaux
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
      // Métadonnées Twitter Card
      twitter: {
        card: 'summary_large_image',
        title: `${pokemonName} #${String(pokemon.id).padStart(3, '0')} | Pokédex`,
        description,
        images: imageUrl ? [imageUrl] : [],
      },
    };
  } catch {
    // Métadonnées de fallback en cas d'erreur
    return {
      title: 'Pokémon non trouvé | Pokédex',
      description: 'Ce Pokémon n\'a pas été trouvé dans le Pokédex.',
    };
  }
}

/**
 * Composant Page - Affiche l'en-tête de la page détail
 * 
 * Note : Ce composant ne contient que l'en-tête car le reste du contenu
 * est géré par les Routes Parallèles (@identity, @specs, @evolution, @moves)
 * dans le layout.tsx parent.
 * 
 * @param params - Paramètre de route contenant le nom du Pokémon
 */
export default async function PokemonDetail({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;

  let pokemon: Pokemon;
  try {
    // Vérification de l'existence du Pokémon
    pokemon = await PokeAPI.pokemon(name) as Pokemon;
  } catch {
    // Affichage de la page 404 si le Pokémon n'existe pas
    notFound();
  }

  // Rendu de l'en-tête avec bouton retour et comparaison
  return <PokemonDetailHeader pokemonId={pokemon.id} pokemonName={pokemon.name} />;
}
