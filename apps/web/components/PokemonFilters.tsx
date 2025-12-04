/**
 * Composant de Filtre par Type de Pokémon
 * 
 * Ce composant affiche un sélecteur permettant de filtrer les Pokémon
 * par leur type (Feu, Eau, Plante, etc.). Le filtre est synchronisé
 * avec l'URL pour permettre le partage et le bookmarking.
 * 
 * Concepts clés pour les étudiants :
 * - Navigation avec paramètres URL (searchParams)
 * - Sélecteur natif HTML avec composant shadcn/ui
 * - Mise à jour de l'URL sans rechargement de page
 * - Données statiques pour les options de filtre
 * 
 * Fonctionnement :
 * 1. L'utilisateur sélectionne un type dans le dropdown
 * 2. L'URL est mise à jour avec le paramètre ?type=xxx
 * 3. Le Server Component parent reçoit le nouveau paramètre
 * 4. Les Pokémon sont filtrés par type côté serveur
 */

'use client';

import { Select } from "@workspace/ui/components/select";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

/**
 * Liste des types de Pokémon
 * 
 * Chaque type a :
 * - value : valeur technique (en anglais, utilisée par l'API)
 * - label : libellé affiché (en français pour l'UI)
 * 
 * Le premier élément avec une valeur vide représente "Tous les types"
 */
const POKEMON_TYPES = [
  { value: '', label: 'Tous les types' },
  { value: 'fire', label: 'Feu' },
  { value: 'water', label: 'Eau' },
  { value: 'grass', label: 'Plante' },
  { value: 'electric', label: 'Électrique' },
  { value: 'psychic', label: 'Psy' },
  { value: 'ice', label: 'Glace' },
  { value: 'dragon', label: 'Dragon' },
  { value: 'dark', label: 'Ténèbres' },
  { value: 'fairy', label: 'Fée' },
  { value: 'normal', label: 'Normal' },
  { value: 'fighting', label: 'Combat' },
  { value: 'flying', label: 'Vol' },
  { value: 'poison', label: 'Poison' },
  { value: 'ground', label: 'Sol' },
  { value: 'rock', label: 'Roche' },
  { value: 'bug', label: 'Insecte' },
  { value: 'ghost', label: 'Spectre' },
  { value: 'steel', label: 'Acier' },
];

/**
 * Composant PokemonFilters - Filtre par type de Pokémon
 * 
 * Ce composant utilise les hooks de navigation de Next.js pour :
 * - Lire le filtre actuel depuis l'URL
 * - Mettre à jour l'URL quand l'utilisateur change la sélection
 * 
 * Le filtre persiste dans l'URL, permettant de partager un lien
 * filtré ou de revenir en arrière avec le bouton précédent du navigateur.
 */
export function PokemonFilters() {
  // Lecture des paramètres de l'URL actuelle
  const searchParams = useSearchParams();
  // Chemin actuel (ex: "/pokemon")
  const pathname = usePathname();
  // Fonction pour naviguer sans recharger la page
  const { replace } = useRouter();

  /**
   * Gère le changement de type sélectionné
   * 
   * @param type - Le type sélectionné (ex: "fire") ou chaîne vide pour tous
   * 
   * Cette fonction :
   * 1. Crée une copie des paramètres URL actuels
   * 2. Ajoute ou supprime le paramètre 'type'
   * 3. Navigue vers la nouvelle URL sans ajouter d'entrée dans l'historique
   */
  const handleTypeChange = (type: string) => {
    const params = new URLSearchParams(searchParams);
    if (type) {
      params.set('type', type);
    } else {
      params.delete('type');
    }
    replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="w-full max-w-xs flex items-center space-x-2">
      <label htmlFor="type-filter" className="block text-sm font-medium mb-1">
        Type
      </label>
      <Select
        id="type-filter"
        value={searchParams.get('type') || ''}
        onChange={(e) => handleTypeChange(e.target.value)}
      >
        {POKEMON_TYPES.map((type) => (
          <option key={type.value} value={type.value}>
            {type.label}
          </option>
        ))}
      </Select>
    </div>
  );
}
