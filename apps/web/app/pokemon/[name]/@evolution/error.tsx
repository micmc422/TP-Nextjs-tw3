/**
 * Composant de Gestion d'Erreur - Slot @evolution
 * 
 * Ce fichier gère les erreurs spécifiques au chargement de la chaîne d'évolution.
 * Contrairement à error.tsx à la racine, cette erreur est localisée à ce slot.
 * 
 * Concepts clés pour les étudiants :
 * - Chaque slot parallèle peut avoir son propre error.tsx
 * - L'erreur d'un slot n'affecte pas les autres slots
 * - Le composant DOIT être un Client Component ("use client")
 * - La prop reset() permet de retenter le chargement
 */

'use client';

import { useEffect } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { AlertCircle } from 'lucide-react';

/**
 * Props du composant Error
 * @param error - L'objet d'erreur JavaScript
 * @param reset - Fonction pour retenter le rendu du slot
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Log de l'erreur pour le débogage
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card className="border-destructive/50 border-dashed mb-8">
      <CardHeader className="pb-2">
        {/* En-tête avec icône d'alerte et titre */}
        <CardTitle className="text-lg flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          Évolutions indisponibles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Impossible de charger la chaîne d&apos;évolution.
        </p>
        {/* Bouton pour retenter le chargement */}
        <Button variant="outline" size="sm" onClick={() => reset()}>
          Réessayer
        </Button>
      </CardContent>
    </Card>
  );
}
