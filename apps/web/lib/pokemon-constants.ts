/**
 * Constantes Partagées pour les Composants Pokémon
 * 
 * Ce fichier centralise les constantes utilisées dans plusieurs composants
 * liés aux Pokémon (couleurs, types, générations, etc.).
 * 
 * Concepts clés pour les étudiants :
 * - Centralisation des constantes pour éviter la duplication
 * - Typage strict avec "as const" pour les tableaux
 * - Record<K, V> pour les mappings typés
 * - Fonctions utilitaires pour le formatage
 */

/**
 * Couleurs Tailwind CSS pour chaque type de Pokémon
 * Utilisées pour styliser les badges et éléments visuels
 */
export const typeColors: Record<string, string> = {
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
 * Liste des 18 types de Pokémon
 * "as const" crée un tuple readonly pour un typage précis
 */
export const pokemonTypes = [
  'fire', 'water', 'grass', 'electric', 'psychic', 'ice', 'dragon', 'dark',
  'fairy', 'normal', 'fighting', 'flying', 'poison', 'ground', 'rock', 'bug', 'ghost', 'steel'
] as const;

/**
 * Couleurs pour les catégories de dégâts des attaques
 * - physical : Attaques physiques (contact direct)
 * - special : Attaques spéciales (à distance)
 * - status : Attaques de statut (effets sans dégâts)
 */
export const damageClassColors: Record<string, string> = {
  physical: "bg-orange-500",
  special: "bg-blue-500",
  status: "bg-gray-500",
};

/**
 * Liste des catégories de dégâts disponibles
 */
export const damageClasses = ['physical', 'special', 'status'] as const;

/**
 * Liste des générations de Pokémon (I à IX)
 * Format de l'API PokeAPI : "generation-i", "generation-ii", etc.
 */
export const generations = [
  'generation-i',
  'generation-ii',
  'generation-iii',
  'generation-iv',
  'generation-v',
  'generation-vi',
  'generation-vii',
  'generation-viii',
  'generation-ix',
] as const;

/**
 * Niveaux de fermeté des baies
 * Du plus mou au plus dur
 */
export const firmnessLevels = [
  'very-soft', 'soft', 'hard', 'very-hard', 'super-hard'
] as const;

/**
 * Formate un nom en remplaçant les tirets par des espaces
 * et en mettant en majuscule chaque mot
 * 
 * @param name - Nom à formater (ex: "special-attack")
 * @returns Nom formaté (ex: "Special Attack")
 * 
 * @example
 * formatName("fire-punch") // "Fire Punch"
 */
export function formatName(name: string): string {
  return name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Formate un nom de génération pour l'affichage
 * Remplace "generation" par "Génération" en français
 * 
 * @param name - Nom de génération (ex: "generation-i")
 * @returns Nom formaté (ex: "Génération I")
 */
export function formatGeneration(name: string): string {
  return name.replace(/-/g, ' ').replace('generation', 'Génération');
}
