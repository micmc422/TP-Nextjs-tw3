/**
 * Composant BerryInfiniteList - Liste Infinie de Baies
 * 
 * Ce composant affiche une liste de baies avec défilement infini.
 * Il utilise l'Intersection Observer pour détecter quand charger
 * plus de données au fur et à mesure que l'utilisateur défile.
 * 
 * Concepts clés pour les étudiants :
 * - Intersection Observer API : détection du scroll
 * - Défilement infini : chargement progressif des données
 * - Table : composants shadcn/ui pour les données tabulaires
 * - Cache des détails : évite les requêtes redondantes
 * 
 * Fonctionnement :
 * 1. Charge les 20 premières baies côté serveur (SSR)
 * 2. Affiche le tableau avec les informations de base
 * 3. Charge les détails (type, fermeté) en arrière-plan
 * 4. Quand l'utilisateur approche du bas, charge 20 baies de plus
 */

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

/**
 * Type pour un élément de la liste (format API PokeAPI)
 * L'URL contient l'ID de la baie
 */
type BerryListItem = {
  name: string;
  url: string;
};

/**
 * Type pour les informations détaillées d'une baie
 * Chargées en parallèle après l'affichage initial
 */
type BerryBasicInfo = {
  id: number;
  name: string;
  firmness: { name: string };              // Fermeté de la baie
  natural_gift_type: { name: string } | null;  // Type du talent "Don Naturel"
  size: number;                             // Taille en millimètres
};

/**
 * Extrait l'ID d'une baie depuis son URL
 * @example getIdFromUrl("https://pokeapi.co/api/v2/berry/1/") → "1"
 */
function getIdFromUrl(url: string): string {
  return url.split('/').filter(Boolean).pop() || '';
}

/**
 * Couleurs Tailwind CSS pour chaque type de Pokémon
 * Utilisées pour les badges du type "Don Naturel"
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
 * Props du composant BerryInfiniteList
 * @property initialBerries - Liste initiale chargée côté serveur
 * @property initialOffset - Position de départ pour la pagination
 */
interface BerryInfiniteListProps {
  initialBerries: BerryListItem[];
  initialOffset: number;
}

/**
 * Composant BerryInfiniteList - Tableau de baies avec défilement infini
 * 
 * Ce composant gère :
 * 1. L'affichage du tableau avec les informations de base
 * 2. Le chargement des détails (type, fermeté, taille) en arrière-plan
 * 3. La détection du scroll pour charger plus de baies
 * 4. La navigation vers la page détail au clic sur une ligne
 * 
 * @param initialBerries - Baies chargées côté serveur
 * @param initialOffset - Offset de départ pour la pagination
 */
export function BerryInfiniteList({ 
  initialBerries, 
  initialOffset 
}: BerryInfiniteListProps) {
  // ===== ÉTATS =====
  const [berryList, setBerryList] = useState<BerryListItem[]>(initialBerries);
  const [berryDetails, setBerryDetails] = useState<Map<string, BerryBasicInfo>>(new Map());
  const [offset, setOffset] = useState(initialOffset);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialBerries.length === 20);
  
  // ===== REFS =====
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // Router pour la navigation
  const router = useRouter();

  /**
   * Charge les détails des baies en arrière-plan
   * Utilise un cache (Map) pour éviter les requêtes redondantes
   */
  const fetchBerryDetails = useCallback(async (berries: BerryListItem[]) => {
    setBerryDetails(prevDetails => {
      const newDetails = new Map(prevDetails);
      
      // Filtre les baies dont on a déjà les détails
      const toFetch = berries.filter(b => !newDetails.has(b.name));
      
      if (toFetch.length === 0) return prevDetails;
      
      // Récupération en parallèle avec mise à jour de l'état
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
            // Ignore les erreurs individuelles
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

  // Charge les détails des baies initiales au montage
  useEffect(() => {
    fetchBerryDetails(initialBerries);
  }, [initialBerries, fetchBerryDetails]);

  /**
   * Charge plus de baies quand on atteint le bas de la liste
   */
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

  /**
   * Configure l'IntersectionObserver pour le défilement infini
   * Déclenche loadMore quand l'élément cible devient visible
   */
  useEffect(() => {
    // Nettoie l'ancien observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Crée un nouvel observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      { threshold: 0.1 }  // Déclenche à 10% de visibilité
    );

    // Observe l'élément de déclenchement
    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    // Cleanup
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasMore, loading, loadMore]);

  return (
    <div className="space-y-4">
      {/* Tableau des baies */}
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
              // URL du sprite de la baie (projet pokesprite)
              const imageUrl = `https://raw.githubusercontent.com/msikma/pokesprite/master/items/berry/${b.name}.png`;
              
              return (
                <TableRow 
                  key={b.name} 
                  className="cursor-pointer hover:bg-muted/50 h-[40px]"
                  onClick={() => router.push(`/pokemon/berry/${b.name}`)}
                >
                  {/* Image de la baie */}
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
                  {/* ID formaté */}
                  <TableCell className="font-mono text-muted-foreground">
                    #{id.padStart(3, '0')}
                  </TableCell>
                  {/* Nom de la baie */}
                  <TableCell className="font-medium capitalize">
                    {b.name}
                  </TableCell>
                  {/* Type du talent Don Naturel */}
                  <TableCell>
                    {details?.natural_gift_type && (
                      <Badge 
                        className={`text-white text-xs capitalize ${typeColors[details.natural_gift_type.name] || 'bg-gray-500'}`}
                      >
                        {details.natural_gift_type.name}
                      </Badge>
                    )}
                  </TableCell>
                  {/* Fermeté de la baie */}
                  <TableCell className="capitalize text-muted-foreground">
                    {details?.firmness.name.replace('-', ' ')}
                  </TableCell>
                  {/* Taille en centimètres */}
                  <TableCell className="text-right">
                    {details ? `${details.size / 10} cm` : '-'}
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
        {!hasMore && berryList.length > 0 && (
          <span className="text-muted-foreground text-sm">Toutes les baies ont été chargées !</span>
        )}
      </div>
    </div>
  );
}
