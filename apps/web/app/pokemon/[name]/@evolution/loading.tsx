/**
 * Composant de Chargement - Slot @evolution
 * 
 * Ce fichier définit le placeholder affiché pendant le chargement
 * des données de la chaîne d'évolution.
 * 
 * Concepts clés pour les étudiants :
 * - loading.tsx est automatiquement affiché pendant le fetch des données
 * - Il utilise React Suspense sous le capot
 * - Les Skeletons créent une "sensation" de chargement progressif (UX)
 * - Chaque slot parallèle peut avoir son propre loading.tsx
 */

import { Card, CardHeader, CardTitle, CardContent } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

/**
 * Composant Loading - Affiche un squelette de la chaîne d'évolution
 * 
 * Ce composant imite la structure finale pour minimiser le "layout shift"
 * (saut de mise en page) lors de l'affichage des vraies données.
 */
export default function Loading() {
  return (
    <Card className="p-6 mb-8">
      <CardHeader className="p-0 pb-4">
        <CardTitle>Chaîne d&apos;évolution</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {/* Simulation de 3 Pokémon dans la chaîne d'évolution */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex flex-col items-center p-4">
                {/* Skeleton circulaire pour l'image du Pokémon */}
                <Skeleton className="w-20 h-20 mb-2 rounded-full" />
                {/* Skeleton pour le nom */}
                <Skeleton className="h-4 w-16" />
              </div>
              {/* Flèche entre les évolutions (sauf après la dernière) */}
              {i < 3 && (
                <span className="text-2xl text-muted-foreground">→</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
