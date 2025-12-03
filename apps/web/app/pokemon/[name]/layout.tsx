/**
 * Layout avec Routes Parallèles - Page Détail Pokémon
 * 
 * Ce fichier démontre l'utilisation des Routes Parallèles (Parallel Routes),
 * une fonctionnalité avancée de Next.js App Router.
 * 
 * Concepts clés pour les étudiants :
 * - Les Routes Parallèles permettent de rendre plusieurs pages simultanément
 * - Les dossiers préfixés par @ (ex: @identity, @specs) définissent des "slots"
 * - Chaque slot peut avoir son propre loading.tsx et error.tsx
 * - Le layout reçoit ces slots comme props et contrôle leur disposition
 * 
 * Avantages des Routes Parallèles :
 * - Chargement indépendant : chaque section peut charger ses données séparément
 * - Gestion d'erreur granulaire : une erreur dans un slot n'affecte pas les autres
 * - Streaming : permet l'affichage progressif du contenu
 */

export default function PokemonLayout({
    children,      // Contenu principal de la page (page.tsx)
    identity,      // Slot @identity : image et types du Pokémon
    specs,         // Slot @specs : statistiques et caractéristiques
    evolution,     // Slot @evolution : chaîne d'évolution
    moves,         // Slot @moves : capacités et apparitions dans les jeux
}: {
    children: React.ReactNode;
    identity: React.ReactNode;
    specs: React.ReactNode;
    evolution: React.ReactNode;
    moves: React.ReactNode;
}) {
    return (
        <div className="container mx-auto py-6 sm:py-8 md:py-10 px-4 max-w-6xl">
            {/* En-tête de la page (contenu de page.tsx) */}
            {children}

            {/* 
              Grille principale : Identité et Spécifications
              Les slots s'affichent côte à côte sur desktop, empilés sur mobile
              Chaque slot a son propre chargement indépendant grâce au streaming
            */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-10 md:mb-12">
                {identity}
                {specs}
            </div>

            {/* Sections supplémentaires : Évolution et Capacités */}
            {evolution}
            {moves}
        </div>
    );
}
