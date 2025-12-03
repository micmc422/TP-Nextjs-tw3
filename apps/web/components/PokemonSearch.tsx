/**
 * Composant de Recherche Pokémon avec Debounce
 * 
 * Ce composant illustre plusieurs concepts avancés de Next.js et React :
 * - Gestion des paramètres URL (searchParams)
 * - Navigation programmatique avec le router
 * - Debouncing pour optimiser les appels API
 * - Synchronisation de l'état local avec l'URL
 * 
 * Concepts clés pour les étudiants :
 * - useSearchParams : accède aux paramètres de l'URL (?q=pikachu)
 * - usePathname : récupère le chemin actuel (/pokemon)
 * - useRouter.replace : change l'URL sans ajouter d'entrée dans l'historique
 * - useDebouncedCallback : retarde l'exécution pour éviter les appels excessifs
 */

'use client';

import { Input } from "@workspace/ui/components/input";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { useEffect, useState } from "react";

/**
 * Composant PokemonSearch - Champ de recherche avec mise à jour de l'URL
 * 
 * Fonctionnement :
 * 1. L'utilisateur tape dans le champ
 * 2. Après 300ms d'inactivité (debounce), l'URL est mise à jour
 * 3. La page se re-rend avec les nouveaux searchParams
 * 4. Le Server Component filtre les résultats
 */
export function PokemonSearch() {
  // Hooks de navigation Next.js
  const searchParams = useSearchParams();  // Lecture des params URL
  const pathname = usePathname();          // Chemin actuel
  const { replace } = useRouter();         // Navigation sans historique
  
  // État local pour contrôler l'input (avant debounce)
  // Initialisé avec la valeur actuelle de l'URL
  const [value, setValue] = useState(searchParams.get('q')?.toString() || '');

  /**
   * Synchronise l'état local avec les changements d'URL
   * Nécessaire si l'URL change depuis une autre source (ex: bouton reset)
   */
  useEffect(() => {
    setValue(searchParams.get('q')?.toString() || '');
  }, [searchParams]);

  /**
   * Fonction de recherche avec debounce de 300ms
   * 
   * Le debounce évite de déclencher une recherche à chaque frappe.
   * L'utilisateur doit arrêter de taper pendant 300ms pour que
   * la recherche se déclenche.
   */
  const handleSearch = useDebouncedCallback((term: string) => {
    // Création d'une copie des paramètres actuels
    const params = new URLSearchParams(searchParams);
    
    if (term) {
      // Ajoute ou met à jour le paramètre 'q'
      params.set('q', term);
    } else {
      // Supprime le paramètre si la recherche est vide
      params.delete('q');
    }
    
    // Met à jour l'URL sans recharger la page
    // replace évite d'ajouter une entrée dans l'historique du navigateur
    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
    <div className="w-full max-w-sm">
      <Input
        placeholder="Rechercher un Pokémon..."
        onChange={(e) => {
          // Mise à jour immédiate de l'état local pour un feedback instantané
          setValue(e.target.value);
          // Déclenchement de la recherche après le debounce
          handleSearch(e.target.value);
        }}
        value={value}
      />
    </div>
  );
}
