/**
 * Page Pokédex - Liste des Pokémon avec Recherche et Filtres
 * 
 * Cette page illustre plusieurs concepts avancés de Next.js :
 * - Composants Serveur Asynchrones (async Server Components)
 * - Paramètres de recherche URL (searchParams)
 * - Chargement de données côté serveur
 * - Défilement infini avec hydratation côté client
 * 
 * Concepts clés pour les étudiants :
 * - Les composants async peuvent utiliser await directement
 * - searchParams est une Promise dans Next.js 15+
 * - Le rendu initial se fait côté serveur, puis l'interactivité est ajoutée côté client
 */

import type { Metadata } from "next";
// Import du client API depuis le package partagé du monorepo
import { PokeAPI } from "@workspace/pokeapi";
// Composants de l'application
import { PokemonSearch } from "@/components/PokemonSearch";
import { PokemonFilters } from "@/components/PokemonFilters";
import { PokemonInfiniteList } from "@/components/PokemonInfiniteList";
import { Title } from "@/components/Title";
import { Text } from "@/components/Text";
// Composant du package UI partagé
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { RefreshCw } from "lucide-react";

/**
 * Métadonnées SEO pour la page Pokédex
 */
export const metadata: Metadata = {
  title: "Pokédex",
  description: "Explorez le monde des Pokémon via notre Pokédex intégré. Recherchez par nom et découvrez les détails de chaque Pokémon.",
  keywords: ["Pokémon", "Pokédex", "recherche", "liste"],
  openGraph: {
    title: "Pokédex | Next.js Avancé",
    description: "Explorez le monde des Pokémon via notre Pokédex intégré.",
  },
};

/**
 * Composant de page asynchrone pour le Pokédex
 * 
 * @param searchParams - Paramètres de l'URL (q pour recherche, type pour filtre)
 * 
 * Note : Dans Next.js 15+, searchParams est une Promise et doit être awaité.
 * Cela permet le streaming et l'optimisation du rendu.
 */
export default async function PokemonPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;      // Paramètre de recherche textuelle
    type?: string;   // Paramètre de filtre par type
  }>;
}) {
  // Await des paramètres de recherche (nouveau pattern Next.js 15)
  const { q, type } = await searchParams;
  const query = q || '';
  const typeFilter = type || '';
  const limit = 20; // Nombre de Pokémon à charger initialement

  // Variable pour stocker la liste des Pokémon
  let pokemonList = [];
  
  // Logique de récupération des données selon les filtres actifs
  if (typeFilter) {
    // Mode : Filtrage par type (ex: "fire", "water")
    let typePokemon = await PokeAPI.getPokemonByType(typeFilter);
    // Application du filtre de recherche en plus si présent
    if (query) {
      const q = query.toLowerCase();
      typePokemon = typePokemon.filter((p) => p.name.includes(q));
    }
    pokemonList = typePokemon;
  } else if (query) {
    // Mode : Recherche par nom uniquement
    pokemonList = await PokeAPI.searchPokemonByName(query);
  } else {
    // Mode : Chargement initial pour le défilement infini
    const data = await PokeAPI.listPokemon(limit, 0);
    pokemonList = data.results;
  }

  return (
    <div className="container mx-auto py-6 sm:py-8 md:py-10 px-4 space-y-6 sm:space-y-8">
      {/* En-tête avec titre et description */}
      <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
        <Title level="h1">Pokédex</Title>
        <Text size="lg" className="max-w-2xl">
          Explorez le monde des Pokémon via notre API intégrée. 
          Utilisez la recherche pour filtrer par nom, ou faites défiler pour découvrir plus de Pokémon !
          Survolez les cartes pour ajouter des Pokémon à la comparaison.
        </Text>
        {/* Barre de contrôles : Recherche, Filtres, Réinitialisation */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-2xl justify-center items-center">
          {/* Composant de recherche (Client Component) */}
          <PokemonSearch />
          {/* Composant de filtre par type (Client Component) */}
          <PokemonFilters />
          {/* Bouton de réinitialisation des filtres */}
          <Button 
            variant="outline" 
            size="icon"
            asChild
            className={`shrink-0 ${!query && !typeFilter ? "opacity-50 pointer-events-none" : ""}`}
            title="Réinitialiser les filtres"
          >
            <Link href="/pokemon">
              <RefreshCw className="h-4 w-4" />
              <span className="sr-only">Réinitialiser</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 
        Liste des Pokémon avec défilement infini
        Le composant reçoit les données initiales du serveur et gère 
        le chargement supplémentaire côté client
      */}
      <PokemonInfiniteList 
        initialPokemon={pokemonList}
        initialOffset={limit}
        searchQuery={query}
        typeFilter={typeFilter}
      />
      
      {/* Message si aucun résultat */}
      {pokemonList.length === 0 && (
        <div className="text-center py-12 sm:py-16 md:py-20">
            <Text>
              Aucun Pokémon trouvé
              {query && ` pour "${query}"`}
              {typeFilter && ` de type "${typeFilter}"`}
            </Text>
        </div>
      )}
    </div>
  );
}
