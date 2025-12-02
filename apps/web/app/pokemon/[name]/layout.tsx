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
        <div className="container mx-auto py-6 sm:py-8 md:py-10 px-4 max-w-6xl">
            {children}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
                {identity}
                {specs}
            </div>

            {evolution}
            {moves}
        </div>
    );
}
