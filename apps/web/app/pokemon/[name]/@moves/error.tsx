'use client';

import { useEffect } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@workspace/ui/components/card';
import { AlertCircle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Card className="border-destructive/50 border-dashed mb-8">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2 text-destructive">
          <AlertCircle className="h-5 w-5" />
          Capacités indisponibles
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Impossible de charger les capacités.
        </p>
        <Button variant="outline" size="sm" onClick={() => reset()}>
          Réessayer
        </Button>
      </CardContent>
    </Card>
  );
}
