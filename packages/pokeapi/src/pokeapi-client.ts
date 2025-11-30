// Use global fetch (Node 18+/Next.js)

const BASE = 'https://pokeapi.co/api/v2';

export type NamedAPIResource = { name: string; url: string };
export type Paginated<T> = { count: number; next: string | null; previous: string | null; results: T[] };

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`);
  if (!res.ok) throw new Error(`PokeAPI error ${res.status}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

export const PokeAPI = {
  // Pokemon by name or id
  pokemon(nameOrId: string | number) {
    return get(`/pokemon/${nameOrId}`);
  },
  // Search with pagination
  listPokemon(limit = 20, offset = 0) {
    return get<Paginated<NamedAPIResource>>(`/pokemon?limit=${limit}&offset=${offset}`);
  },
  // Types
  type(nameOrId: string | number) {
    return get(`/type/${nameOrId}`);
  },
  listTypes() {
    return get<Paginated<NamedAPIResource>>(`/type`);
  },
  // Locations and areas
  location(nameOrId: string | number) {
    return get(`/location/${nameOrId}`);
  },
  listLocations(limit = 20, offset = 0) {
    return get<Paginated<NamedAPIResource>>(`/location?limit=${limit}&offset=${offset}`);
  },
  locationArea(nameOrId: string | number) {
    return get(`/location-area/${nameOrId}`);
  },
  // Games: versions, version groups, generations
  version(nameOrId: string | number) {
    return get(`/version/${nameOrId}`);
  },
  versionGroup(nameOrId: string | number) {
    return get(`/version-group/${nameOrId}`);
  },
  generation(nameOrId: string | number) {
    return get(`/generation/${nameOrId}`);
  },
  // Species
  species(nameOrId: string | number) {
    return get(`/pokemon-species/${nameOrId}`);
  },
  // Abilities
  ability(nameOrId: string | number) {
    return get(`/ability/${nameOrId}`);
  },
  // Moves
  move(nameOrId: string | number) {
    return get(`/move/${nameOrId}`);
  },
  listMoves(limit = 20, offset = 0) {
    return get<Paginated<NamedAPIResource>>(`/move?limit=${limit}&offset=${offset}`);
  },
  // Berries
  berry(nameOrId: string | number) {
    return get(`/berry/${nameOrId}`);
  },
  listBerries(limit = 20, offset = 0) {
    return get<Paginated<NamedAPIResource>>(`/berry?limit=${limit}&offset=${offset}`);
  },
  // Items
  item(nameOrId: string | number) {
    return get(`/item/${nameOrId}`);
  },
  // Simple search helper filtering by name from list endpoints
  async searchPokemonByName(query: string, limit = 2000) {
    const data = await this.listPokemon(limit, 0);
    const q = query.toLowerCase();
    return data.results.filter((r) => r.name.includes(q));
  },
};

export type PokeAPIClient = typeof PokeAPI;
