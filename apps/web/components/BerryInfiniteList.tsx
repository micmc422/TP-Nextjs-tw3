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
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

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
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[48px] text-center">Img</TableHead>
              <TableHead className="w-[60px]">ID</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Type (Cadeau)</TableHead>
              <TableHead>Fermeté</TableHead>
              <TableHead className="text-right">Taille</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {berryList.map((b) => {
              const id = getIdFromUrl(b.url);
              const details = berryDetails.get(b.name);
              const imageUrl = `https://raw.githubusercontent.com/msikma/pokesprite/master/items/berry/${b.name}.png`;
              
              return (
                <TableRow 
                  key={b.name} 
                  className="cursor-pointer hover:bg-muted/50 h-[40px]"
                  onClick={() => router.push(`/pokemon/berry/${b.name}`)}
                >
                  <TableCell className="p-1 text-center">
                    <div className="flex items-center justify-center">
                      <Image 
                        src={imageUrl} 
                        alt={b.name}
                        width={32}
                        height={32}
                        className="object-contain pixelated"
                        unoptimized
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-muted-foreground">
                    #{id.padStart(3, '0')}
                  </TableCell>
                  <TableCell className="font-medium capitalize">
                    {b.name}
                  </TableCell>
                  <TableCell>
                    {details?.natural_gift_type && (
                      <Badge 
                        className={`text-white text-xs capitalize ${typeColors[details.natural_gift_type.name] || 'bg-gray-500'}`}
                      >
                        {details.natural_gift_type.name}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">
                    {details?.firmness.name.replace('-', ' ')}
                  </TableCell>
                  <TableCell className="text-right">
                    {details ? `${details.size / 10} cm` : '-'}
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
        {!hasMore && berryList.length > 0 && (
          <span className="text-muted-foreground text-sm">Toutes les baies ont été chargées !</span>
        )}
      </div>
    </div>
  );
}
