import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Text } from "@/components/Text";
import { Title } from "@/components/Title";

export default function NotFound() {
  return (
    <div className="container mx-auto py-20 px-4 max-w-2xl text-center">
      <Card className="border-2 border-dashed">
        <CardHeader>
          <Title level="h1" className="text-4xl mb-2">Page Introuvable</Title>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-6xl">404</div>
          <Text size="lg" className="text-muted-foreground">
            Désolé, la page que vous cherchez n&apos;existe pas.
          </Text>
          <div className="pt-4">
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
