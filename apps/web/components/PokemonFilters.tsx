'use client';

import { Select } from "@workspace/ui/components/select";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

// Pokemon types list
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

export function PokemonFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

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
    <div className="w-full max-w-xs">
      <label htmlFor="type-filter" className="block text-sm font-medium mb-1">
        Filtrer par type
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
