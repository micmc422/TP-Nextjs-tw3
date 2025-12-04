/**
 * Composant MoveInfiniteList - Liste Infinie de Capacités Pokémon
 * 
 * Ce composant affiche un tableau de capacités (moves) avec défilement infini
 * et des filtres par type et catégorie de dégâts.
 * 
 * Concepts clés pour les étudiants :
 * - Intersection Observer API : détection du scroll
 * - Filtrage côté client : useMemo pour optimiser les calculs
 * - État multiple : liste, détails, filtres, chargement
 * - Cache des données : évite les requêtes redondantes
 * 
 * Catégories de dégâts (damage_class) :
 * - physical : attaques physiques (utilise l'Attaque)
 * - special : attaques spéciales (utilise l'Atq. Spé)
 * - status : attaques de statut (pas de dégâts directs)
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
import { typeColors, pokemonTypes, damageClassColors, damageClasses, formatName } from "@/lib/pokemon-constants";

/**
 * Type pour un élément de la liste (format API PokeAPI)
 */
type MoveListItem = {
  name: string;
  url: string;
};

/**
 * Type pour les informations détaillées d'une capacité
 * Chargées en parallèle après l'affichage initial
 */
type MoveBasicInfo = {
  id: number;
  name: string;
  type: { name: string } | null;           // Type de la capacité (fire, water, etc.)
  damage_class: { name: string } | null;   // Catégorie (physical, special, status)
  power: number | null;                     // Puissance (null pour les capacités de statut)
  accuracy: number | null;                  // Précision en pourcentage
  pp: number | null;                        // Points de pouvoir (utilisations)
};

/**
 * Extrait l'ID d'une capacité depuis son URL
 * @example getIdFromUrl("https://pokeapi.co/api/v2/move/1/") → "1"
 */
function getIdFromUrl(url: string): string {
  return url.split('/').filter(Boolean).pop() || '';
}

/**
 * Props du composant MoveInfiniteList
 */
interface MoveInfiniteListProps {
  initialMoves: MoveListItem[];
  initialOffset: number;
}

/**
 * Composant MoveInfiniteList - Tableau de capacités avec défilement infini
 * 
 * Fonctionnalités :
 * 1. Affichage paginé avec défilement infini
 * 2. Filtrage par type de capacité
 * 3. Filtrage par catégorie de dégâts
 * 4. Chargement des détails en arrière-plan
 * 5. Navigation vers la page détail au clic
 * 
 * @param initialMoves - Capacités chargées côté serveur
 * @param initialOffset - Offset de départ pour la pagination
 */
export function MoveInfiniteList({ 
  initialMoves, 
  initialOffset 
}: MoveInfiniteListProps) {
  // ===== ÉTATS DE LA LISTE =====
  const [moveList, setMoveList] = useState<MoveListItem[]>(initialMoves);
  const [moveDetails, setMoveDetails] = useState<Map<string, MoveBasicInfo>>(new Map());
  const [offset, setOffset] = useState(initialOffset);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialMoves.length === 20);
  
  // ===== REFS =====
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  
  // ===== ÉTATS DES FILTRES =====
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [damageClassFilter, setDamageClassFilter] = useState<string>('');

  /**
   * Charge les détails des capacités en arrière-plan
   * Utilise un cache (Map) pour éviter les requêtes redondantes
   */
  const fetchMoveDetails = useCallback(async (moves: MoveListItem[]) => {
    setMoveDetails(prevDetails => {
      const newDetails = new Map(prevDetails);
      
      // Filtre les capacités dont on a déjà les détails
      const toFetch = moves.filter(m => !newDetails.has(m.name));
      
      if (toFetch.length === 0) return prevDetails;
      
      // Récupération en parallèle
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
            // Ignore les erreurs individuelles
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

  // Charge les détails des capacités initiales
  useEffect(() => {
    fetchMoveDetails(initialMoves);
  }, [initialMoves, fetchMoveDetails]);

  /**
   * Charge plus de capacités pour le défilement infini
   */
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
   * Filtre les capacités selon les critères sélectionnés
   * 
   * useMemo évite de recalculer la liste à chaque render
   * si les dépendances n'ont pas changé
   */
  const filteredMoves = useMemo(() => {
    return moveList.filter((m) => {
      const details = moveDetails.get(m.name);
      
      // Si les détails ne sont pas encore chargés, afficher la capacité
      // (elle sera filtrée correctement une fois les détails disponibles)
      if (!details) return true;
      
      // Filtrage par type
      if (typeFilter && details.type?.name !== typeFilter) {
        return false;
      }
      
      // Filtrage par catégorie de dégâts
      if (damageClassFilter && details.damage_class?.name !== damageClassFilter) {
        return false;
      }
      
      return true;
    });
  }, [moveList, moveDetails, typeFilter, damageClassFilter]);

  return (
    <div className="space-y-4">
      {/* Section des filtres */}
      <div className="flex flex-wrap gap-4 p-4 bg-muted/30 rounded-lg">
        {/* Filtre par type */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground">Type</label>
          <Select 
            value={typeFilter} 
            onChange={(e) => setTypeFilter(e.target.value)}
            className="w-40"
          >
            <option value="">Tous les types</option>
            {pokemonTypes.map((type) => (
              <option key={type} value={type}>
                {formatName(type)}
              </option>
            ))}
          </Select>
        </div>
        {/* Filtre par catégorie de dégâts */}
        <div className="flex flex-col gap-1">
          <label className="text-sm text-muted-foreground">Catégorie</label>
          <Select 
            value={damageClassFilter} 
            onChange={(e) => setDamageClassFilter(e.target.value)}
            className="w-40"
          >
            <option value="">Toutes</option>
            {damageClasses.map((dc) => (
              <option key={dc} value={dc}>
                {formatName(dc)}
              </option>
            ))}
          </Select>
        </div>
        {/* Bouton de réinitialisation des filtres */}
        {(typeFilter || damageClassFilter) && (
          <div className="flex items-end">
            <button
              onClick={() => {
                setTypeFilter('');
                setDamageClassFilter('');
              }}
              className="text-sm text-primary hover:underline"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>

      {/* Compteur de résultats filtrés */}
      {(typeFilter || damageClassFilter) && (
        <div className="text-sm text-muted-foreground">
          {filteredMoves.length} capacité(s) trouvée(s)
        </div>
      )}

      {/* Tableau des capacités */}
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
            {filteredMoves.map((m) => {
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
                  {/* Badge du type de la capacité */}
                  <TableCell>
                    {details?.type && (
                      <Badge 
                        className={`text-white text-xs capitalize ${typeColors[details.type.name] || 'bg-gray-500'}`}
                      >
                        {details.type.name}
                      </Badge>
                    )}
                  </TableCell>
                  {/* Badge de la catégorie de dégâts */}
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
                  {/* Puissance (- si capacité de statut) */}
                  <TableCell className="text-right">
                    {details?.power ?? '-'}
                  </TableCell>
                  {/* Précision en pourcentage */}
                  <TableCell className="text-right">
                    {details?.accuracy ? `${details.accuracy}%` : '-'}
                  </TableCell>
                  {/* Points de pouvoir */}
                  <TableCell className="text-right">
                    {details?.pp ?? '-'}
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
        {!hasMore && moveList.length > 0 && (
          <span className="text-muted-foreground text-sm">Toutes les capacités ont été chargées !</span>
        )}
      </div>
    </div>
  );
}
