/**
 * Page Liste des Utilisateurs
 * 
 * Cette page affiche la liste de tous les utilisateurs enregistrés.
 * Elle utilise les données de la base MongoDB via le package @workspace/database.
 * 
 * Concepts clés pour les étudiants :
 * - Composant Serveur Asynchrone (Server Component)
 * - Récupération de données côté serveur
 * - Affichage de listes avec Table UI
 * - Liens vers les pages de détail
 */

import type { Metadata } from "next";
import Link from "next/link";
import { Title } from "@/components/Title";
import { Text } from "@/components/Text";
import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Users, UserPlus, Eye } from "lucide-react";

/**
 * Métadonnées SEO pour la page Liste des Utilisateurs
 */
export const metadata: Metadata = {
  title: "Liste des Utilisateurs",
  description: "Consultez la liste de tous les utilisateurs enregistrés dans l'application.",
  keywords: ["utilisateurs", "liste", "authentification", "gestion"],
  openGraph: {
    title: "Liste des Utilisateurs | Next.js Avancé",
    description: "Consultez la liste de tous les utilisateurs enregistrés dans l'application.",
  },
};

/**
 * Interface pour représenter un utilisateur dans la liste
 * Note : Correspond au modèle User du package @workspace/database
 */
interface UserListItem {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Données de démonstration pour les utilisateurs
 * Note : En production, ces données viendraient de MongoDB via le package @workspace/database
 * 
 * Exemple avec MongoDB :
 * import { listUsers } from "@workspace/database";
 * const users = await listUsers();
 */
const demoUsers: UserListItem[] = [
  {
    _id: "1",
    email: "jean.dupont@example.com",
    name: "Jean Dupont",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    _id: "2",
    email: "marie.martin@example.com",
    name: "Marie Martin",
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-03-10"),
  },
  {
    _id: "3",
    email: "pierre.durand@example.com",
    name: "Pierre Durand",
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-03-05"),
  },
];

/**
 * Composant de page pour la liste des utilisateurs
 */
export default async function UtilisateursPage() {
  // En production : const users = await listUsers();
  const users = demoUsers;

  return (
    <div className="container mx-auto py-6 sm:py-8 md:py-10 px-4 space-y-6 sm:space-y-8">
      {/* En-tête avec titre et description */}
      <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-primary" />
          <Title level="h1">Liste des Utilisateurs</Title>
        </div>
        <Text size="lg" className="max-w-2xl">
          Consultez et gérez les utilisateurs enregistrés dans l'application.
          Cliquez sur un utilisateur pour voir ses détails.
        </Text>
        <Button asChild>
          <Link href="/utilisateur/nouveau">
            <UserPlus className="mr-2 h-4 w-4" />
            Nouvel utilisateur
          </Link>
        </Button>
      </div>

      {/* Card contenant la table des utilisateurs */}
      <Card>
        <CardHeader>
          <CardTitle>Utilisateurs ({users.length})</CardTitle>
          <CardDescription>
            Liste de tous les utilisateurs avec leurs informations de base.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Date de création</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/utilisateur/${user._id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Voir
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Text className="text-muted-foreground">
                Aucun utilisateur trouvé.
              </Text>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
