/**
 * Page 404 - Page Non Trouvée
 * 
 * Ce fichier définit l'interface affichée lorsqu'une page n'existe pas.
 * Dans Next.js App Router, le fichier `not-found.tsx` est automatiquement
 * utilisé quand la fonction `notFound()` est appelée ou quand une route n'existe pas.
 * 
 * Concepts clés pour les étudiants :
 * - C'est un Server Component par défaut (pas de "use client")
 * - Peut être placé à n'importe quel niveau de l'arborescence des routes
 * - Le not-found.tsx à la racine capture toutes les 404 non gérées
 * - Utilisez `notFound()` de 'next/navigation' pour déclencher cette page programmatiquement
 */

import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Text } from "@/components/Text";
import { Title } from "@/components/Title";

/**
 * Composant NotFound - Affiché pour les routes inexistantes
 * 
 * Server Component qui retourne une page d'erreur 404 stylisée.
 * Contrairement à error.tsx, il n'a pas besoin d'être un Client Component.
 */
export default function NotFound() {
  return (
    <div className="container mx-auto py-20 px-4 max-w-2xl text-center">
      {/* Carte avec bordure en pointillés pour un style distinctif */}
      <Card className="border-2 border-dashed">
        <CardHeader>
          <Title level="h1" className="text-4xl mb-2">Page Introuvable</Title>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Grand nombre 404 pour une identification visuelle immédiate */}
          <div className="text-6xl">404</div>
          <Text size="lg" className="text-muted-foreground">
            Désolé, la page que vous cherchez n&apos;existe pas.
          </Text>
          <div className="pt-4">
            {/* 
              Composant Link de Next.js pour une navigation côté client
              Utilise le prefetching automatique pour des transitions rapides
            */}
            <Link href="/">
              <Button size="lg">
                Retour à l&apos;accueil
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
