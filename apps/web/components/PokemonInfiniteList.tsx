'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import Image from "next/image";
import Link from "next/link";

type PokemonListItem = {
  name: string;
  url: string;
};

type PokemonBasicInfo = {
  id: number;
  name: string;
  types: { type: { name: string } }[];
  sprites: {
    front_default: string;
  };
};

// Helper to get ID from URL
function getIdFromUrl(url: string): string {
  return url.split('/').filter(Boolean).pop() || '';
}

// Type colors map
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

interface PokemonInfiniteListProps {
  initialPokemon: PokemonListItem[];
  initialOffset: number;
  searchQuery?: string;
  typeFilter?: string;
}

export function PokemonInfiniteList({
  initialPokemon,
  initialOffset,
  searchQuery,
  typeFilter
}: PokemonInfiniteListProps) {
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>(initialPokemon);
  const [pokemonDetails, setPokemonDetails] = useState<Map<string, PokemonBasicInfo>>(new Map());
  const [offset, setOffset] = useState(initialOffset);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(!searchQuery && !typeFilter && initialPokemon.length === 20);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch Pokemon basic info for types display
  const fetchPokemonDetails = useCallback(async (pokemon: PokemonListItem[]) => {
    setPokemonDetails(prevDetails => {
      const newDetails = new Map(prevDetails);

      // Only fetch details for Pokemon we don't have yet
      const toFetch = pokemon.filter(p => !newDetails.has(p.name));

      if (toFetch.length === 0) return prevDetails;

      // Fetch in background and update state when done
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
            // Ignore errors for individual Pokemon
          }
          return null;
        })
      ).then(results => {
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

  // Load initial Pokemon details
  useEffect(() => {
    fetchPokemonDetails(initialPokemon);
  }, [initialPokemon, fetchPokemonDetails]);

  // Load more Pokemon
  const loadMore = useCallback(async () => {
    if (loading || !hasMore || searchQuery || typeFilter) return;

    setLoading(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
      const data = await res.json();

      if (data.results.length === 0) {
        setHasMore(false);
      } else {
        setPokemonList(prev => [...prev, ...data.results]);
        setOffset(prev => prev + 20);
        fetchPokemonDetails(data.results);
        setHasMore(data.results.length === 20);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset, searchQuery, typeFilter, fetchPokemonDetails]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, loadMore]);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {pokemonList.map((p) => {
          const id = getIdFromUrl(p.url);
          const details = pokemonDetails.get(p.name);
          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

          return (
            <Link href={`/pokemon/${p.name}`} key={p.name} className="group">
              <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden border-muted">
                <CardHeader className="p-4 bg-muted/20 group-hover:bg-muted/40 transition-colors">
                  <div className="relative w-full aspect-square">
                    <Image
                      src={imageUrl}
                      alt={p.name}
                      fill
                      className="object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4 text-center space-y-2">
                  <span className="text-xs font-mono text-muted-foreground">#{id.padStart(3, '0')}</span>
                  <CardTitle className="capitalize text-lg">{p.name}</CardTitle>
                  {details && (
                    <div className="flex flex-wrap gap-1 justify-center">
                      {details.types.map((t) => (
                        <Badge
                          key={t.type.name}
                          className={`text-white text-xs capitalize ${typeColors[t.type.name] || 'bg-gray-500'}`}
                        >
                          {t.type.name}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="py-8 flex justify-center">
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
            <span>Chargement...</span>
          </div>
        )}
        {!hasMore && pokemonList.length > 0 && !searchQuery && !typeFilter && (
          <span className="text-muted-foreground">Tous les Pokémon ont été chargés !</span>
        )}
        {typeFilter && pokemonList.length > 0 && (
          <span className="text-muted-foreground">
            {pokemonList.length} Pokémon de type {typeFilter} trouvés
          </span>
        )}
      </div>
    </>
  );
}
