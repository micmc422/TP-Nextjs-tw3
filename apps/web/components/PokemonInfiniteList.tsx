/**
 * Composant Liste Infinie de Pokémon
 * 
 * Ce composant implémente le défilement infini (infinite scroll) pour charger
 * progressivement les Pokémon au fur et à mesure que l'utilisateur scrolle.
 * 
 * Concepts clés pour les étudiants :
 * - Intersection Observer API pour détecter le scroll
 * - Gestion d'état avec useState et useCallback
 * - Optimisation avec useEffect et useRef
 * - Pattern "load more" avec pagination
 * - Rendu conditionnel basé sur les filtres
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
// Composants UI du package partagé
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import Image from "next/image";
import Link from "next/link";
// Bouton de comparaison
import { AddToCompareButton } from "./AddToCompareButton";

/**
 * Type pour un élément de la liste (format API PokeAPI)
 */
type PokemonListItem = {
  name: string;
  url: string;  // URL vers les détails complets
};

/**
 * Type pour les informations de base d'un Pokémon (chargées en parallèle)
 */
type PokemonBasicInfo = {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  sprites: {
    front_default: string;
  };
};

/**
 * Extrait l'ID d'un Pokémon depuis son URL
 * @example getIdFromUrl("https://pokeapi.co/api/v2/pokemon/25/") → "25"
 */
function getIdFromUrl(url: string): string {
  return url.split('/').filter(Boolean).pop() || '';
}

/**
 * Couleurs Tailwind CSS pour chaque type de Pokémon
 */
const typeColors: Record<string, string> = {
  fire: "bg-red-500",
  water: "bg-blue-500",
  grass: "bg-green-500",
  electric: "bg-yellow-500",
  psychic: "bg-pink-500",
  ice: "bg-cyan-500",
  dragon: "bg-indigo-500",
  dark: "bg-slate-800",
  fairy: "bg-rose-400",
  normal: "bg-gray-400",
  fighting: "bg-orange-700",
  flying: "bg-sky-400",
  poison: "bg-purple-500",
  ground: "bg-amber-600",
  rock: "bg-stone-500",
  bug: "bg-lime-500",
  ghost: "bg-violet-700",
  steel: "bg-slate-400",
};

/**
 * Props du composant PokemonInfiniteList
 */
interface PokemonInfiniteListProps {
  initialPokemon: PokemonListItem[];  // Pokémon chargés côté serveur
  initialOffset: number;              // Offset de départ pour la pagination
  searchQuery?: string;               // Filtre de recherche actif
  typeFilter?: string;                // Filtre de type actif
}

/**
 * Composant PokemonInfiniteList - Liste avec défilement infini
 * 
 * Fonctionnement :
 * 1. Reçoit les Pokémon initiaux du serveur (SSR)
 * 2. Charge les détails (types) en parallèle côté client
 * 3. Détecte le scroll avec IntersectionObserver
 * 4. Charge plus de Pokémon quand l'utilisateur approche du bas
 * 
 * @param initialPokemon - Liste initiale (chargée côté serveur)
 * @param initialOffset - Position de départ pour le prochain chargement
 * @param searchQuery - Terme de recherche (désactive le scroll infini si présent)
 * @param typeFilter - Filtre par type (désactive le scroll infini si présent)
 */
export function PokemonInfiniteList({
  initialPokemon,
  initialOffset,
  searchQuery,
  typeFilter
}: PokemonInfiniteListProps) {
  // ===== ÉTATS =====
  // Liste des Pokémon affichés
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>(initialPokemon);
  // Cache des détails (types, sprites) par nom
  const [pokemonDetails, setPokemonDetails] = useState<Map<string, PokemonBasicInfo>>(new Map());
  // Position pour la pagination
  const [offset, setOffset] = useState(initialOffset);
  // Indicateur de chargement
  const [loading, setLoading] = useState(false);
  // Y a-t-il encore des Pokémon à charger ?
  const [hasMore, setHasMore] = useState(!searchQuery && !typeFilter && initialPokemon.length === 20);
  
  // ===== REFS =====
  // Référence à l'IntersectionObserver
  const observerRef = useRef<IntersectionObserver | null>(null);
  // Élément déclencheur du chargement
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Log pour le débogage
  console.log('Rendering PokemonInfiniteList with', { searchQuery, typeFilter });

  /**
   * Charge les détails (types, sprites) des Pokémon en arrière-plan
   * Utilise un cache pour éviter les requêtes dupliquées
   */
  const fetchPokemonDetails = useCallback(async (pokemon: PokemonListItem[]) => {
    setPokemonDetails(prevDetails => {
      const newDetails = new Map(prevDetails);

      // Filtre les Pokémon dont on a déjà les détails
      const toFetch = pokemon.filter(p => !newDetails.has(p.name));

      if (toFetch.length === 0) return prevDetails;

      // Fetch en parallèle avec Promise.all
      Promise.all(
        toFetch.map(async (p) => {
          try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${p.name}`);
            if (res.ok) {
              const data = await res.json();
              return {
                name: p.name,
                details: {
                  id: data.id,
                  name: data.name,
                  types: data.types,
                  sprites: data.sprites,
                } as PokemonBasicInfo
              };
            }
          } catch {
            // Ignore les erreurs individuelles (le Pokémon s'affichera sans détails)
          }
          return null;
        })
      ).then(results => {
        // Met à jour le cache avec les nouveaux détails
        setPokemonDetails(prev => {
          const updated = new Map(prev);
          results.forEach(r => {
            if (r) updated.set(r.name, r.details);
          });
          return updated;
        });
      });

      return prevDetails;
    });
  }, []);

  // Charge les détails des Pokémon initiaux
  useEffect(() => {
    fetchPokemonDetails(initialPokemon);
  }, [initialPokemon, fetchPokemonDetails, searchQuery, typeFilter]);

  // Synchronise l'état quand initialPokemon change (nouveau filtre/recherche)
  useEffect(() => {
    setPokemonList(initialPokemon);
    setOffset(initialOffset);
    // Désactive le scroll infini si des filtres sont actifs
    setHasMore(!searchQuery && !typeFilter && initialPokemon.length === 20);
  }, [initialPokemon, initialOffset, searchQuery, typeFilter]);

  /**
   * Charge plus de Pokémon quand on atteint le bas de la liste
   */
  const loadMore = useCallback(async () => {
    // Ne pas charger si déjà en cours, plus rien à charger, ou filtres actifs
    if (loading || !hasMore || searchQuery || typeFilter) return;

    setLoading(true);
    try {
      // Appel API pour les 20 Pokémon suivants
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
      const data = await res.json();

      if (data.results.length === 0) {
        setHasMore(false);
      } else {
        // Ajoute les nouveaux Pokémon à la liste existante
        setPokemonList(prev => [...prev, ...data.results]);
        setOffset(prev => prev + 20);
        // Charge leurs détails en arrière-plan
        fetchPokemonDetails(data.results);
        setHasMore(data.results.length === 20);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset, searchQuery, typeFilter, fetchPokemonDetails]);

  /**
   * Configure l'IntersectionObserver pour détecter le scroll
   * L'observer déclenche loadMore quand l'élément cible devient visible
   */
  useEffect(() => {
    // Nettoie l'ancien observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Crée un nouvel observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // Déclenche le chargement quand l'élément est visible
        if (entries[0]?.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 } // Déclenche quand 10% de l'élément est visible
    );

    // Observe l'élément de déclenchement
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    // Cleanup à la destruction du composant
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, loadMore]);

  return (
    <>
      {/* Grille de cartes Pokémon */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {pokemonList.map((p) => {
          const id = getIdFromUrl(p.url);
          const details = pokemonDetails.get(p.name);
          // URL de l'artwork officiel
          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
          const pokemonId = parseInt(id, 10);

          return (
            <div key={p.name} className="group relative">
              {/* Lien vers la page détail */}
              <Link href={`/pokemon/${p.name}`}>
                <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden border-muted">
                  {/* En-tête avec image */}
                  <CardHeader className="p-2 sm:p-4 bg-muted/20 group-hover:bg-muted/40 transition-colors">
                    <div className="relative w-full aspect-square">
                      <Image
                        src={imageUrl}
                        alt={p.name}
                        fill
                        className="object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                      />
                    </div>
                  </CardHeader>
                  {/* Contenu : ID, nom, types */}
                  <CardContent className="p-2 sm:p-4 text-center space-y-1 sm:space-y-2">
                    <span className="text-xs font-mono text-muted-foreground">#{id.padStart(3, '0')}</span>
                    <CardTitle className="capitalize text-sm sm:text-lg">{p.name}</CardTitle>
                    {/* Badges des types (si chargés) */}
                    {details && (
                      <div className="flex flex-wrap gap-1 justify-center">
                        {details.types.map((t) => (
                          <Badge
                            key={t.type.name}
                            className={`text-white text-[10px] sm:text-xs capitalize ${typeColors[t.type.name] || 'bg-gray-500'}`}
                          >
                            {t.type.name}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
              {/* Bouton de comparaison (visible au survol) */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <AddToCompareButton
                  pokemonId={pokemonId}
                  pokemonName={p.name}
                  variant="icon"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Zone de déclenchement du scroll infini */}
      <div ref={loadMoreRef} className="py-6 sm:py-8 flex justify-center">
        {/* Indicateur de chargement */}
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
            <span>Chargement...</span>
          </div>
        )}
        {/* Message de fin de liste */}
        {!hasMore && pokemonList.length > 0 && !searchQuery && !typeFilter && (
          <span className="text-muted-foreground">Tous les Pokémon ont été chargés !</span>
        )}
        {/* Message pour le filtre par type */}
        {typeFilter && pokemonList.length > 0 && (
          <span className="text-muted-foreground">
            {pokemonList.length} Pokémon de type {typeFilter} trouvés
          </span>
        )}
      </div>
    </>
  );
}
