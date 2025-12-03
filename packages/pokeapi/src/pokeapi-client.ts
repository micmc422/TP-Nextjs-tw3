/**
 * Client API pour PokeAPI - Package partagé du Monorepo
 * 
 * Ce fichier définit un client HTTP pour interagir avec l'API REST publique PokeAPI.
 * Il est organisé comme un package réutilisable dans le monorepo (@workspace/pokeapi).
 * 
 * Concepts clés pour les étudiants :
 * - Utilisation de l'API fetch native (Node.js 18+ / Next.js)
 * - Export de types TypeScript pour une meilleure DX
 * - Pattern "namespace object" pour organiser les méthodes API
 * - Gestion d'erreurs HTTP basique
 * 
 * Avantages de l'organisation en package :
 * - Réutilisable dans plusieurs applications du monorepo
 * - Centralise la logique d'appel API
 * - Facilite les mises à jour et la maintenance
 */

// URL de base de l'API PokeAPI v2
const BASE = 'https://pokeapi.co/api/v2';

/**
 * Type générique pour les ressources nommées de l'API
 * Utilisé pour les listes de Pokémon, types, capacités, etc.
 */
export type NamedAPIResource = { name: string; url: string };

/**
 * Type générique pour les réponses paginées de l'API
 * @template T - Le type des éléments dans la liste results
 */
export type Paginated<T> = { 
  count: number;           // Nombre total d'éléments
  next: string | null;     // URL de la page suivante (null si dernière page)
  previous: string | null; // URL de la page précédente (null si première page)
  results: T[]            // Liste des éléments de la page actuelle
};

/**
 * Fonction utilitaire générique pour les appels GET à l'API
 * 
 * @template T - Le type de retour attendu
 * @param path - Le chemin relatif de l'endpoint (ex: "/pokemon/pikachu")
 * @returns Promise avec les données typées
 * @throws Error si la réponse HTTP n'est pas OK
 * 
 * Note : Un délai de 300ms est simulé pour démontrer les états de chargement
 */
async function get<T>(path: string): Promise<T> {
  // Simulation d'un délai réseau pour les démonstrations pédagogiques
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const res = await fetch(`${BASE}${path}`);
  // Vérification du statut HTTP
  if (!res.ok) throw new Error(`PokeAPI error ${res.status}: ${res.statusText}`);
  // Parsing et typage de la réponse JSON
  return res.json() as Promise<T>;
}

/**
 * Client PokeAPI - Objet contenant toutes les méthodes d'accès à l'API
 * 
 * Organisation par catégorie de ressources :
 * - Pokémon (pokemon, listPokemon, searchPokemonByName)
 * - Types (type, listTypes, getPokemonByType)
 * - Espèces (species)
 * - Capacités (ability, listAbilities)
 * - Attaques (move, listMoves)
 * - Baies (berry, listBerries)
 * - Objets (item)
 * - Localisations (location, locationArea)
 * - Versions de jeu (version, versionGroup, generation)
 */
export const PokeAPI = {
  /**
   * Récupère les données d'un Pokémon par son nom ou son ID
   * @param nameOrId - Nom (ex: "pikachu") ou ID (ex: 25) du Pokémon
   */
  pokemon(nameOrId: string | number) {
    return get(`/pokemon/${nameOrId}`);
  },

  /**
   * Liste les Pokémon avec pagination
   * @param limit - Nombre de résultats par page (défaut: 20)
   * @param offset - Point de départ dans la liste (défaut: 0)
   */
  listPokemon(limit = 20, offset = 0) {
    return get<Paginated<NamedAPIResource>>(`/pokemon?limit=${limit}&offset=${offset}`);
  },

  /**
   * Récupère les données d'un type par son nom ou ID
   */
  type(nameOrId: string | number) {
    return get(`/type/${nameOrId}`);
  },

  /**
   * Liste tous les types de Pokémon
   */
  listTypes() {
    return get<Paginated<NamedAPIResource>>(`/type`);
  },

  /**
   * Récupère les données d'une localisation
   */
  location(nameOrId: string | number) {
    return get(`/location/${nameOrId}`);
  },

  /**
   * Liste les localisations avec pagination
   */
  listLocations(limit = 20, offset = 0) {
    return get<Paginated<NamedAPIResource>>(`/location?limit=${limit}&offset=${offset}`);
  },

  /**
   * Récupère les données d'une zone de localisation
   */
  locationArea(nameOrId: string | number) {
    return get(`/location-area/${nameOrId}`);
  },

  /**
   * Récupère les données d'une version de jeu
   */
  version(nameOrId: string | number) {
    return get(`/version/${nameOrId}`);
  },

  /**
   * Récupère les données d'un groupe de versions
   */
  versionGroup(nameOrId: string | number) {
    return get(`/version-group/${nameOrId}`);
  },

  /**
   * Récupère les données d'une génération
   */
  generation(nameOrId: string | number) {
    return get(`/generation/${nameOrId}`);
  },

  /**
   * Récupère les données d'espèce d'un Pokémon (contient les évolutions, descriptions, etc.)
   */
  species(nameOrId: string | number) {
    return get(`/pokemon-species/${nameOrId}`);
  },

  /**
   * Récupère les données d'un talent (ability)
   */
  ability(nameOrId: string | number) {
    return get(`/ability/${nameOrId}`);
  },

  /**
   * Liste les talents avec pagination
   */
  listAbilities(limit = 20, offset = 0) {
    return get<Paginated<NamedAPIResource>>(`/ability?limit=${limit}&offset=${offset}`);
  },

  /**
   * Récupère les données d'une attaque (move)
   */
  move(nameOrId: string | number) {
    return get(`/move/${nameOrId}`);
  },

  /**
   * Liste les attaques avec pagination
   */
  listMoves(limit = 20, offset = 0) {
    return get<Paginated<NamedAPIResource>>(`/move?limit=${limit}&offset=${offset}`);
  },

  /**
   * Récupère les données d'une baie
   */
  berry(nameOrId: string | number) {
    return get(`/berry/${nameOrId}`);
  },

  /**
   * Liste les baies avec pagination
   */
  listBerries(limit = 20, offset = 0) {
    return get<Paginated<NamedAPIResource>>(`/berry?limit=${limit}&offset=${offset}`);
  },

  /**
   * Récupère les données d'un objet
   */
  item(nameOrId: string | number) {
    return get(`/item/${nameOrId}`);
  },

  /**
   * Recherche des Pokémon par nom (filtrage côté client)
   * 
   * Note : Cette méthode charge TOUS les Pokémon puis filtre localement.
   * En production, on préférerait une API de recherche côté serveur.
   * 
   * @param query - Terme de recherche (correspondance partielle)
   * @param limit - Nombre maximum de Pokémon à charger (défaut: 2000)
   */
  async searchPokemonByName(query: string, limit = 2000) {
    const data = await this.listPokemon(limit, 0);
    const q = query.toLowerCase();
    return data.results.filter((r) => r.name.includes(q));
  },

  /**
   * Récupère tous les Pokémon d'un type donné
   * 
   * @param typeName - Nom du type (ex: "fire", "water")
   * @returns Liste des Pokémon de ce type
   */
  async getPokemonByType(typeName: string): Promise<NamedAPIResource[]> {
    // Type local pour la structure de réponse de l'API
    type TypeResponse = {
      pokemon: { pokemon: NamedAPIResource }[];
    };
    const data = await get<TypeResponse>(`/type/${typeName}`);
    // Extraction des Pokémon depuis la structure imbriquée
    return data.pokemon.map((p) => p.pokemon);
  },
};

/**
 * Type exporté pour le client PokeAPI
 * Utile pour typer des paramètres qui acceptent le client
 */
export type PokeAPIClient = typeof PokeAPI;
