'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import Image from "next/image";
import Link from "next/link";

type BerryListItem = {
  name: string;
  url: string;
};

type BerryBasicInfo = {
  id: number;
  name: string;
  firmness: { name: string };
  natural_gift_type: { name: string } | null;
  size: number;
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

interface BerryInfiniteListProps {
  initialBerries: BerryListItem[];
  initialOffset: number;
}

export function BerryInfiniteList({ 
  initialBerries, 
  initialOffset 
}: BerryInfiniteListProps) {
  const [berryList, setBerryList] = useState<BerryListItem[]>(initialBerries);
  const [berryDetails, setBerryDetails] = useState<Map<string, BerryBasicInfo>>(new Map());
  const [offset, setOffset] = useState(initialOffset);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialBerries.length === 20);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Fetch Berry basic info
  const fetchBerryDetails = useCallback(async (berries: BerryListItem[]) => {
    setBerryDetails(prevDetails => {
      const newDetails = new Map(prevDetails);
      
      // Only fetch details for berries we don't have yet
      const toFetch = berries.filter(b => !newDetails.has(b.name));
      
      if (toFetch.length === 0) return prevDetails;
      
      // Fetch in background and update state when done
      Promise.all(
        toFetch.map(async (b) => {
          try {
            const res = await fetch(`https://pokeapi.co/api/v2/berry/${b.name}`);
            if (res.ok) {
              const data = await res.json();
              return {
                name: b.name,
                details: {
                  id: data.id,
                  name: data.name,
                  firmness: data.firmness,
                  natural_gift_type: data.natural_gift_type,
                  size: data.size,
                } as BerryBasicInfo
              };
            }
          } catch {
            // Ignore errors for individual berries
          }
          return null;
        })
      ).then(results => {
        setBerryDetails(prev => {
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

  // Load initial berry details
  useEffect(() => {
    fetchBerryDetails(initialBerries);
  }, [initialBerries, fetchBerryDetails]);

  // Load more berries
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/berry?limit=20&offset=${offset}`);
      const data = await res.json();
      
      if (data.results.length === 0) {
        setHasMore(false);
      } else {
        setBerryList(prev => [...prev, ...data.results]);
        setOffset(prev => prev + 20);
        fetchBerryDetails(data.results);
        setHasMore(data.results.length === 20);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset, fetchBerryDetails]);

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
        {berryList.map((b) => {
          const id = getIdFromUrl(b.url);
          const details = berryDetails.get(b.name);
          // Berry sprites are available via item sprites
          const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${b.name}-berry.png`;
          
          return (
            <Link href={`/pokemon/berry/${b.name}`} key={b.name} className="group">
              <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden border-muted">
                <CardHeader className="p-4 bg-muted/20 group-hover:bg-muted/40 transition-colors">
                  <div className="relative w-full aspect-square flex items-center justify-center">
                    <Image 
                      src={imageUrl} 
                      alt={b.name}
                      width={96}
                      height={96}
                      className="object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-4 text-center space-y-2">
                  <span className="text-xs font-mono text-muted-foreground">#{id.padStart(3, '0')}</span>
                  <CardTitle className="capitalize text-lg">{b.name}</CardTitle>
                  {details && (
                    <div className="flex flex-wrap gap-1 justify-center">
                      {details.natural_gift_type && (
                        <Badge 
                          className={`text-white text-xs capitalize ${typeColors[details.natural_gift_type.name] || 'bg-gray-500'}`}
                        >
                          {details.natural_gift_type.name}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs capitalize">
                        {details.firmness.name}
                      </Badge>
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
        {!hasMore && berryList.length > 0 && (
          <span className="text-muted-foreground">Toutes les baies ont été chargées !</span>
        )}
      </div>
    </>
  );
}
