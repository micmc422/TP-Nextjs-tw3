'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";
import { Select } from "@workspace/ui/components/select";
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

// Available generations
const generations = [
  'generation-i',
  'generation-ii',
  'generation-iii',
  'generation-iv',
  'generation-v',
  'generation-vi',
  'generation-vii',
  'generation-viii',
  'generation-ix',
];

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
  
  // Filter states
  const [generationFilter, setGenerationFilter] = useState<string>('');
  const [mainSeriesFilter, setMainSeriesFilter] = useState<string>('');

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

  // Filter abilities based on selected filters
  const filteredAbilities = useMemo(() => {
    return abilityList.filter((a) => {
      const details = abilityDetails.get(a.name);
      
      // If details not loaded yet, show the ability (will be filtered when details load)
      if (!details) return true;
      
      // Filter by generation
      if (generationFilter && details.generation?.name !== generationFilter) {
        return false;
      }
      
      // Filter by main series
      if (mainSeriesFilter === 'yes' && !details.is_main_series) {
        return false;
      }
      if (mainSeriesFilter === 'no' && details.is_main_series) {
        return false;
      }
      
      return true;
    });
  }, [abilityList, abilityDetails, generationFilter, mainSeriesFilter]);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground">Génération</label>
          <Select 
            value={generationFilter} 
            onChange={(e) => setGenerationFilter(e.target.value)}
            className="w-48"
          >
            <option value="">Toutes les générations</option>
            {generations.map((gen) => (
              <option key={gen} value={gen}>
                {gen.replace(/-/g, ' ').replace('generation', 'Génération')}
              </option>
            ))}
          </Select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground">Série principale</label>
          <Select 
            value={mainSeriesFilter} 
            onChange={(e) => setMainSeriesFilter(e.target.value)}
            className="w-40"
          >
            <option value="">Tous</option>
            <option value="yes">Oui</option>
            <option value="no">Non</option>
          </Select>
        </div>
        {(generationFilter || mainSeriesFilter) && (
          <div className="flex items-end">
            <button
              onClick={() => {
                setGenerationFilter('');
                setMainSeriesFilter('');
              }}
              className="text-sm text-primary hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Results count */}
      {(generationFilter || mainSeriesFilter) && (
        <div className="text-sm text-muted-foreground">
          {filteredAbilities.length} talent(s) trouvé(s)
        </div>
      )}

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
            {filteredAbilities.map((a) => {
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
