/**
 * Page 404 Pokémon - Pokémon Non Trouvé
 * 
 * Cette page s'affiche lorsqu'un Pokémon spécifique n'existe pas dans l'API.
 * C'est un not-found.tsx spécifique au segment /pokemon, distinct du 404 global.
 * 
 * Concepts clés pour les étudiants :
 * - Les fichiers not-found.tsx peuvent être imbriqués par segment de route
 * - Ce fichier capture les 404 pour /pokemon/[name] quand le Pokémon n'existe pas
 * - Personnalisation du message d'erreur selon le contexte
 */

import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Text } from "@/components/Text";
import { Title } from "@/components/Title";

/**
 * Composant NotFound - Page d'erreur pour les Pokémon inexistants
 * 
 * Affiche un message convivial et un bouton pour retourner au Pokédex.
 */
export default function NotFound() {
    return (
        <div className="container mx-auto py-20 px-4 max-w-2xl text-center">
            <Card className="border-2 border-dashed">
                <CardHeader>
                    <Title level="h1" className="text-4xl mb-2">Pokémon Introuvable</Title>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Grand point d'interrogation pour une identification visuelle */}
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
