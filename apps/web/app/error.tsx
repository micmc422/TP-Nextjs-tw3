"use client";

import { useEffect } from "react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Text } from "@/components/Text";
import { Title } from "@/components/Title";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto py-20 px-4 max-w-2xl text-center">
      <Card className="border-destructive/50 border-2">
        <CardHeader>
          <Title level="h1" className="text-4xl mb-2 text-destructive">Une erreur est survenue</Title>
        </CardHeader>
        <CardContent className="space-y-6">
          <Text size="lg" className="text-muted-foreground">
            Nous sommes désolés, mais quelque chose s&apos;est mal passé.
          </Text>
          {error.message && (
             <div className="bg-destructive/10 p-4 rounded-md text-sm font-mono text-left overflow-auto max-h-40">
               {error.message}
             </div>
          )}
          <div className="pt-4 flex justify-center gap-4">
            <Button onClick={() => reset()} variant="default">
              Réessayer
            </Button>
            <Button onClick={() => window.location.href = "/"} variant="outline">
              Retour à l&apos;accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
