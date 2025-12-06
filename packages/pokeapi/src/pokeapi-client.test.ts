import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PokeAPI } from './pokeapi-client';

// Mock global fetch
const fetchMock = vi.fn();
globalThis.fetch = fetchMock;

describe('PokeAPI Client', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('should fetch a pokemon by name', async () => {
    const mockResponse = { name: 'pikachu', id: 25 };
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await PokeAPI.pokemon('pikachu');
    
    expect(fetchMock).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/pikachu');
    expect(result).toEqual(mockResponse);
  });

  it('should fetch a list of pokemon', async () => {
    const mockResponse = {
      count: 100,
      results: [{ name: 'bulbasaur', url: '...' }],
    };
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    const result = await PokeAPI.listPokemon(10, 0);

    expect(fetchMock).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=10&offset=0');
    expect(result).toEqual(mockResponse);
  });

  it('should search pokemon by name locally', async () => {
    const mockList = {
      results: [
        { name: 'pikachu', url: '1' },
        { name: 'raichu', url: '2' },
        { name: 'bulbasaur', url: '3' },
      ],
    };
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => mockList,
    } as Response);

    const result = await PokeAPI.searchPokemonByName('chu');

    expect(fetchMock).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon?limit=2000&offset=0');
    expect(result).toHaveLength(2);
    expect(result).toEqual([
        { name: 'pikachu', url: '1' },
        { name: 'raichu', url: '2' }
    ]);
  });

  it('should throw an error when api fails', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    } as Response);

    await expect(PokeAPI.pokemon('unknown')).rejects.toThrow('PokeAPI error 404: Not Found');
  });
});
