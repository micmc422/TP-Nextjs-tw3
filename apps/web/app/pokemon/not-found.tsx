import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Text } from "@/components/Text";
import { Title } from "@/components/Title";

export default function NotFound() {
    return (
        <div className="container mx-auto py-20 px-4 max-w-2xl text-center">
            <Card className="border-2 border-dashed">
                <CardHeader>
                    <Title level="h1" className="text-4xl mb-2">Pokémon Introuvable</Title>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-6xl">?</div>
                    <Text size="lg" className="text-muted-foreground">
                        Désolé, nous n&apos;avons pas trouvé le Pokémon que vous cherchez.
                        Il est possible que le nom soit mal orthographié ou que ce Pokémon n&apos;existe pas encore dans notre base de données.
                    </Text>
                    <div className="pt-4">
                        <Link href="/pokemon">
                            <Button size="lg">
                                Retour au Pokédex
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
