/**
 * Composant AbilityInfiniteList - Liste Infinie de Talents Pokémon
 * 
 * Ce composant affiche un tableau de talents (abilities) avec défilement infini
 * et des filtres par génération et appartenance à la série principale.
 * 
 * Concepts clés pour les étudiants :
 * - Intersection Observer API : détection du scroll
 * - Filtrage côté client : useMemo pour optimiser les calculs
 * - État multiple : liste, détails, filtres, chargement
 * - Générations Pokémon : I à IX (versions Rouge/Bleu à Écarlate/Violet)
 * 
 * Talents (Abilities) :
 * - Capacités passives des Pokémon
 * - Introduites en génération III
 * - Certains talents sont cachés (obtenables uniquement par méthodes spéciales)
 * - "Série principale" distingue les jeux principaux des spin-offs
 */

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
import { generations, formatGeneration } from "@/lib/pokemon-constants";

/**
 * Type pour un élément de la liste (format API PokeAPI)
 */
type AbilityListItem = {
  name: string;
  url: string;
};

/**
 * Type pour les informations détaillées d'un talent
 * Chargées en parallèle après l'affichage initial
 */
type AbilityBasicInfo = {
  id: number;
  name: string;
  generation: { name: string } | null;   // Génération d'introduction (generation-i, etc.)
  is_main_series: boolean;                // true si le talent existe dans la série principale
  pokemon_count: number;                  // Nombre de Pokémon possédant ce talent
};

/**
 * Extrait l'ID d'un talent depuis son URL
 * @example getIdFromUrl("https://pokeapi.co/api/v2/ability/1/") → "1"
 */
function getIdFromUrl(url: string): string {
  return url.split('/').filter(Boolean).pop() || '';
}

/**
 * Props du composant AbilityInfiniteList
 */
interface AbilityInfiniteListProps {
  initialAbilities: AbilityListItem[];
  initialOffset: number;
}

/**
 * Composant AbilityInfiniteList - Tableau de talents avec défilement infini
 * 
 * Fonctionnalités :
 * 1. Affichage paginé avec défilement infini
 * 2. Filtrage par génération d'introduction
 * 3. Filtrage par appartenance à la série principale
 * 4. Chargement des détails (nombre de Pokémon) en arrière-plan
 * 5. Navigation vers la page détail au clic
 * 
 * @param initialAbilities - Talents chargés côté serveur
 * @param initialOffset - Offset de départ pour la pagination
 */
export function AbilityInfiniteList({ 
  initialAbilities, 
  initialOffset 
}: AbilityInfiniteListProps) {
  // ===== ÉTATS DE LA LISTE =====
  const [abilityList, setAbilityList] = useState<AbilityListItem[]>(initialAbilities);
  const [abilityDetails, setAbilityDetails] = useState<Map<string, AbilityBasicInfo>>(new Map());
  const [offset, setOffset] = useState(initialOffset);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialAbilities.length === 20);
  
  // ===== REFS =====
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // ===== ÉTATS DES FILTRES =====
  const [generationFilter, setGenerationFilter] = useState<string>('');
  const [mainSeriesFilter, setMainSeriesFilter] = useState<string>('');

  /**
   * Charge les détails des talents en arrière-plan
   * Utilise un cache (Map) pour éviter les requêtes redondantes
   */
  const fetchAbilityDetails = useCallback(async (abilities: AbilityListItem[]) => {
    setAbilityDetails(prevDetails => {
      const newDetails = new Map(prevDetails);
      
      // Filtre les talents dont on a déjà les détails
      const toFetch = abilities.filter(a => !newDetails.has(a.name));
      
      if (toFetch.length === 0) return prevDetails;
      
      // Récupération en parallèle
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
            // Ignore les erreurs individuelles
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

  // Charge les détails des talents initiaux
  useEffect(() => {
    fetchAbilityDetails(initialAbilities);
  }, [initialAbilities, fetchAbilityDetails]);

  /**
   * Charge plus de talents pour le défilement infini
   */
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

  /**
   * Configure l'IntersectionObserver pour le défilement infini
   */
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

  /**
   * Filtre les talents selon les critères sélectionnés
   * 
   * useMemo évite de recalculer la liste à chaque render
   * si les dépendances n'ont pas changé
   */
  const filteredAbilities = useMemo(() => {
    return abilityList.filter((a) => {
      const details = abilityDetails.get(a.name);
      
      // Si les détails ne sont pas encore chargés, afficher le talent
      if (!details) return true;
      
      // Filtrage par génération
      if (generationFilter && details.generation?.name !== generationFilter) {
        return false;
      }
      
      // Filtrage par série principale
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
      {/* Section des filtres */}
      <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
        {/* Filtre par génération */}
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
                {formatGeneration(gen)}
              </option>
            ))}
          </Select>
        </div>
        {/* Filtre par série principale */}
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
        {/* Bouton de réinitialisation des filtres */}
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

      {/* Compteur de résultats filtrés */}
      {(generationFilter || mainSeriesFilter) && (
        <div className="text-sm text-muted-foreground">
          {filteredAbilities.length} talent(s) trouvé(s)
        </div>
      )}

      {/* Tableau des talents */}
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
                  {/* ID formaté */}
                  <TableCell className="font-mono text-muted-foreground">
                    #{id.padStart(3, '0')}
                  </TableCell>
                  {/* Nom du talent formaté */}
                  <TableCell className="font-medium capitalize">
                    {a.name.replace(/-/g, ' ')}
                  </TableCell>
                  {/* Génération d'introduction */}
                  <TableCell className="capitalize text-muted-foreground">
                    {details?.generation?.name.replace(/-/g, ' ') || '-'}
                  </TableCell>
                  {/* Nombre de Pokémon possédant ce talent */}
                  <TableCell className="text-right">
                    {details?.pokemon_count ?? '-'}
                  </TableCell>
                  {/* Badge Oui/Non pour la série principale */}
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

      {/* Zone de déclenchement du défilement infini */}
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
