import { PokeAPI } from "@workspace/pokeapi";
import { Card, CardHeader, CardTitle, CardContent } from "@workspace/ui/components/card";
import { Text } from "@/components/Text";
import { Badge } from "@workspace/ui/components/badge";
import Link from "next/link";
import { notFound } from "next/navigation";

// Type definitions
interface Pokemon {
  moves: { move: { name: string } }[];
  game_indices: { version: { name: string } }[];
}

export default async function MovesPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;

  const pokemon = await PokeAPI.pokemon(name) as Pokemon;

  // Get some notable moves (limit to 12)
  const moves = pokemon.moves.slice(0, 12);

  // Get game versions where this Pokemon appears
  const gameIndices = pokemon.game_indices;

  return (
    <>
      {/* Moves */}
      {moves.length > 0 && (
        <Card className="p-6 mb-8">
          <CardHeader className="p-0 pb-4">
            <CardTitle>Capacités (Moves)</CardTitle>
            <Text className="text-sm text-muted-foreground">Quelques capacités que ce Pokémon peut apprendre</Text>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-wrap gap-2">
              {moves.map((m) => (
                <Link key={m.move.name} href={`/pokemon/move/${m.move.name}`}>
                  <Badge variant="outline" className="capitalize cursor-pointer hover:bg-muted">
                    {m.move.name.replace('-', ' ')}
                  </Badge>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Game Appearances */}
      {gameIndices.length > 0 && (
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle>Apparitions dans les jeux</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="flex flex-wrap gap-2">
              {gameIndices.map((g) => (
                <Badge key={g.version.name} variant="secondary" className="capitalize">
                  {g.version.name.replace('-', ' ')}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}
