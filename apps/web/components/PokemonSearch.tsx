'use client';

import { Input } from "@workspace/ui/components/input";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useEffect, useState } from "react";

export function PokemonSearch() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  
  // Local state to handle input value
  const [value, setValue] = useState(searchParams.get('q')?.toString() || '');

  // Sync local state with URL params
  useEffect(() => {
    setValue(searchParams.get('q')?.toString() || '');
  }, [searchParams]);

  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="w-full max-w-sm">
      <Input
        placeholder="Rechercher un Pokémon..."
        onChange={(e) => {
          setValue(e.target.value);
          handleSearch(e.target.value);
        }}
        value={value}
      />
    </div>
  );
}
