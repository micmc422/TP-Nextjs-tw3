/**
 * Composant de Gestion des Erreurs - Error Boundary
 * 
 * Ce fichier définit le composant qui s'affiche lorsqu'une erreur se produit
 * dans un segment de route. C'est un "Error Boundary" de Next.js.
 * 
 * Concepts clés pour les étudiants :
 * - Le fichier `error.tsx` capture les erreurs JavaScript dans son segment et ses enfants
 * - Il DOIT être un Client Component ("use client") car il utilise des hooks React
 * - La prop `reset` permet de retenter le rendu de l'interface
 * - L'erreur est automatiquement logée côté serveur par Next.js
 * 
 * Note : error.tsx ne capture PAS les erreurs du layout.tsx parent.
 * Pour cela, utilisez global-error.tsx
 */

"use client";

import { useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Text } from "@/components/Text";
import { Title } from "@/components/Title";

/**
 * Props du composant Error
 * @param error - L'objet d'erreur JavaScript avec un digest optionnel (ID unique de l'erreur)
 * @param reset - Fonction pour tenter de re-rendre le segment de route
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  // Effet pour logger l'erreur (utile pour envoyer à un service de monitoring)
  useEffect(() => {
    // On pourrait ici envoyer l'erreur à un service comme Sentry, LogRocket, etc.
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto py-20 px-4 max-w-2xl text-center">
      {/* Carte stylisée avec une bordure rouge indiquant une erreur */}
      <Card className="border-destructive/50 border-2">
        <CardHeader>
          <Title level="h1" className="text-4xl mb-2 text-destructive">Une erreur est survenue</Title>
        </CardHeader>
        <CardContent className="space-y-6">
          <Text size="lg" className="text-muted-foreground">
            Nous sommes désolés, mais quelque chose s&apos;est mal passé.
          </Text>
          {/* Affichage conditionnel du message d'erreur pour le débogage */}
          {error.message && (
             <div className="bg-destructive/10 p-4 rounded-md text-sm font-mono text-left overflow-auto max-h-40">
               {error.message}
             </div>
          )}
          {/* Boutons d'action pour récupérer de l'erreur */}
          <div className="pt-4 flex justify-center gap-4">
            {/* reset() tente de re-rendre le segment sans recharger la page */}
            <Button onClick={() => reset()} variant="default">
              Réessayer
            </Button>
            {/* Redirection vers la page d'accueil en cas d'échec */}
            <Button onClick={() => window.location.href = "/"} variant="outline">
              Retour à l&apos;accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
