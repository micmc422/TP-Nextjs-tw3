'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";
import { useRouter } from "next/navigation";

type AbilityListItem = {
  name: string;
  url: string;
};

type AbilityBasicInfo = {
  id: number;
  name: string;
  generation: { name: string } | null;
  is_main_series: boolean;
  pokemon_count: number;
};

// Helper to get ID from URL
function getIdFromUrl(url: string): string {
  return url.split('/').filter(Boolean).pop() || '';
}

interface AbilityInfiniteListProps {
  initialAbilities: AbilityListItem[];
  initialOffset: number;
}

export function AbilityInfiniteList({ 
  initialAbilities, 
  initialOffset 
}: AbilityInfiniteListProps) {
  const [abilityList, setAbilityList] = useState<AbilityListItem[]>(initialAbilities);
  const [abilityDetails, setAbilityDetails] = useState<Map<string, AbilityBasicInfo>>(new Map());
  const [offset, setOffset] = useState(initialOffset);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialAbilities.length === 20);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch Ability basic info
  const fetchAbilityDetails = useCallback(async (abilities: AbilityListItem[]) => {
    setAbilityDetails(prevDetails => {
      const newDetails = new Map(prevDetails);
      
      // Only fetch details for abilities we don't have yet
      const toFetch = abilities.filter(a => !newDetails.has(a.name));
      
      if (toFetch.length === 0) return prevDetails;
      
      // Fetch in background and update state when done
      Promise.all(
        toFetch.map(async (a) => {
          try {
            const res = await fetch(`https://pokeapi.co/api/v2/ability/${a.name}`);
            if (res.ok) {
              const data = await res.json();
              return {
                name: a.name,
                details: {
                  id: data.id,
                  name: data.name,
                  generation: data.generation,
                  is_main_series: data.is_main_series,
                  pokemon_count: data.pokemon?.length || 0,
                } as AbilityBasicInfo
              };
            }
          } catch {
            // Ignore errors for individual abilities
          }
          return null;
        })
      ).then(results => {
        setAbilityDetails(prev => {
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

  // Load initial ability details
  useEffect(() => {
    fetchAbilityDetails(initialAbilities);
  }, [initialAbilities, fetchAbilityDetails]);

  // Load more abilities
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/ability?limit=20&offset=${offset}`);
      const data = await res.json();
      
      if (data.results.length === 0) {
        setHasMore(false);
      } else {
        setAbilityList(prev => [...prev, ...data.results]);
        setOffset(prev => prev + 20);
        fetchAbilityDetails(data.results);
        setHasMore(data.results.length === 20);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset, fetchAbilityDetails]);

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
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Génération</TableHead>
              <TableHead className="text-right">Pokémon</TableHead>
              <TableHead className="text-center">Série principale</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {abilityList.map((a) => {
              const id = getIdFromUrl(a.url);
              const details = abilityDetails.get(a.name);
              
              return (
                <TableRow 
                  key={a.name} 
                  className="cursor-pointer hover:bg-muted/50 h-[40px]"
                  onClick={() => router.push(`/pokemon/ability/${a.name}`)}
                >
                  <TableCell className="font-mono text-muted-foreground">
                    #{id.padStart(3, '0')}
                  </TableCell>
                  <TableCell className="font-medium capitalize">
                    {a.name.replace(/-/g, ' ')}
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">
                    {details?.generation?.name.replace(/-/g, ' ') || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {details?.pokemon_count ?? '-'}
                  </TableCell>
                  <TableCell className="text-center">
                    {details?.is_main_series !== undefined ? (
                      <Badge 
                        variant={details.is_main_series ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {details.is_main_series ? 'Oui' : 'Non'}
                      </Badge>
                    ) : '-'}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Infinite scroll trigger */}
      <div ref={loadMoreRef} className="py-4 flex justify-center">
        {loading && (
          <div className="flex items-center gap-2 text-muted-foreground text-sm">
            <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
            <span>Chargement...</span>
          </div>
        )}
        {!hasMore && abilityList.length > 0 && (
          <span className="text-muted-foreground text-sm">Tous les talents ont été chargés !</span>
        )}
      </div>
    </div>
  );
}
