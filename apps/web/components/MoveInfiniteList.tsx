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

type MoveListItem = {
  name: string;
  url: string;
};

type MoveBasicInfo = {
  id: number;
  name: string;
  type: { name: string } | null;
  damage_class: { name: string } | null;
  power: number | null;
  accuracy: number | null;
  pp: number | null;
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

// Damage class colors
const damageClassColors: Record<string, string> = {
  physical: "bg-orange-500",
  special: "bg-blue-500",
  status: "bg-gray-500",
};

interface MoveInfiniteListProps {
  initialMoves: MoveListItem[];
  initialOffset: number;
}

export function MoveInfiniteList({ 
  initialMoves, 
  initialOffset 
}: MoveInfiniteListProps) {
  const [moveList, setMoveList] = useState<MoveListItem[]>(initialMoves);
  const [moveDetails, setMoveDetails] = useState<Map<string, MoveBasicInfo>>(new Map());
  const [offset, setOffset] = useState(initialOffset);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialMoves.length === 20);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Fetch Move basic info
  const fetchMoveDetails = useCallback(async (moves: MoveListItem[]) => {
    setMoveDetails(prevDetails => {
      const newDetails = new Map(prevDetails);
      
      // Only fetch details for moves we don't have yet
      const toFetch = moves.filter(m => !newDetails.has(m.name));
      
      if (toFetch.length === 0) return prevDetails;
      
      // Fetch in background and update state when done
      Promise.all(
        toFetch.map(async (m) => {
          try {
            const res = await fetch(`https://pokeapi.co/api/v2/move/${m.name}`);
            if (res.ok) {
              const data = await res.json();
              return {
                name: m.name,
                details: {
                  id: data.id,
                  name: data.name,
                  type: data.type,
                  damage_class: data.damage_class,
                  power: data.power,
                  accuracy: data.accuracy,
                  pp: data.pp,
                } as MoveBasicInfo
              };
            }
          } catch {
            // Ignore errors for individual moves
          }
          return null;
        })
      ).then(results => {
        setMoveDetails(prev => {
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

  // Load initial move details
  useEffect(() => {
    fetchMoveDetails(initialMoves);
  }, [initialMoves, fetchMoveDetails]);

  // Load more moves
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/move?limit=20&offset=${offset}`);
      const data = await res.json();
      
      if (data.results.length === 0) {
        setHasMore(false);
      } else {
        setMoveList(prev => [...prev, ...data.results]);
        setOffset(prev => prev + 20);
        fetchMoveDetails(data.results);
        setHasMore(data.results.length === 20);
      }
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, offset, fetchMoveDetails]);

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
              <TableHead>Type</TableHead>
              <TableHead>Catégorie</TableHead>
              <TableHead className="text-right">Puissance</TableHead>
              <TableHead className="text-right">Précision</TableHead>
              <TableHead className="text-right">PP</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {moveList.map((m) => {
              const id = getIdFromUrl(m.url);
              const details = moveDetails.get(m.name);
              
              return (
                <TableRow 
                  key={m.name} 
                  className="cursor-pointer hover:bg-muted/50 h-[40px]"
                  onClick={() => router.push(`/pokemon/move/${m.name}`)}
                >
                  <TableCell className="font-mono text-muted-foreground">
                    #{id.padStart(3, '0')}
                  </TableCell>
                  <TableCell className="font-medium capitalize">
                    {m.name.replace(/-/g, ' ')}
                  </TableCell>
                  <TableCell>
                    {details?.type && (
                      <Badge 
                        className={`text-white text-xs capitalize ${typeColors[details.type.name] || 'bg-gray-500'}`}
                      >
                        {details.type.name}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {details?.damage_class && (
                      <Badge 
                        variant="outline"
                        className={`text-white text-xs capitalize ${damageClassColors[details.damage_class.name] || 'bg-gray-500'}`}
                      >
                        {details.damage_class.name}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {details?.power ?? '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {details?.accuracy ? `${details.accuracy}%` : '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    {details?.pp ?? '-'}
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
        {!hasMore && moveList.length > 0 && (
          <span className="text-muted-foreground text-sm">Toutes les capacités ont été chargées !</span>
        )}
      </div>
    </div>
  );
}
