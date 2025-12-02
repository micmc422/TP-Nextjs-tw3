import Link from "next/link";
import { Button } from "@workspace/ui/components/button";

export default function PokemonLayout({
    children,
    identity,
    specs,
    evolution,
    moves,
}: {
    children: React.ReactNode;
    identity: React.ReactNode;
    specs: React.ReactNode;
    evolution: React.ReactNode;
    moves: React.ReactNode;
}) {
    return (
        <div className="container mx-auto py-10 px-4 max-w-6xl">
            <div className="mb-6">
                <Link href="/pokemon">
                    <Button variant="outline">← Retour au Pokédex</Button>
                </Link>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
                {identity}
                {specs}
            </div>

            {evolution}
            {moves}

            {children}
        </div>
    );
}
