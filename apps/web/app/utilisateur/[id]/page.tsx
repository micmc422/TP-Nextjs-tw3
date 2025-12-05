/**
 * Page Détail Utilisateur - Route Dynamique
 * 
 * Cette page affiche les détails d'un utilisateur spécifique.
 * Elle illustre les routes dynamiques dans Next.js App Router.
 * 
 * Concepts clés pour les étudiants :
 * - Le dossier [id] crée une route dynamique capturant le paramètre "id"
 * - generateMetadata permet de créer des métadonnées SEO basées sur les données
 * - La fonction notFound() déclenche l'affichage de not-found.tsx
 * - Les params sont une Promise dans Next.js 15+ (async patterns)
 * 
 * URL exemple : /utilisateur/1 → params.id = "1"
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Title } from "@/components/Title";
import { Text } from "@/components/Text";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { ArrowLeft, Mail, Calendar, User, Edit, Trash2 } from "lucide-react";

/**
 * Interface pour représenter un utilisateur
 * Note : Correspond au modèle User du package @workspace/database
 */
interface User {
  _id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Données de démonstration pour les utilisateurs
 * Note : En production, ces données viendraient de MongoDB via findUserById
 */
const demoUsers: Record<string, User> = {
  "1": {
    _id: "1",
    email: "jean.dupont@example.com",
    name: "Jean Dupont",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  "2": {
    _id: "2",
    email: "marie.martin@example.com",
    name: "Marie Martin",
    createdAt: new Date("2024-02-20"),
    updatedAt: new Date("2024-03-10"),
  },
  "3": {
    _id: "3",
    email: "pierre.durand@example.com",
    name: "Pierre Durand",
    createdAt: new Date("2024-03-05"),
    updatedAt: new Date("2024-03-05"),
  },
};

/**
 * Simule la récupération d'un utilisateur par son ID
 * En production : import { findUserById } from "@workspace/database";
 */
async function getUserById(id: string): Promise<User | null> {
  return demoUsers[id] || null;
}

/**
 * Génération des Métadonnées Dynamiques pour le SEO
 * 
 * @param params - Contient le paramètre de route (id de l'utilisateur)
 * @returns Métadonnées pour le SEO et le partage social
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    return {
      title: "Utilisateur non trouvé",
      description: "Cet utilisateur n'a pas été trouvé dans la base de données.",
    };
  }

  return {
    title: `${user.name} | Profil Utilisateur`,
    description: `Profil de ${user.name} (${user.email})`,
    openGraph: {
      title: `${user.name} | Profil Utilisateur`,
      description: `Profil de ${user.name} (${user.email})`,
    },
  };
}

/**
 * Composant Page - Affiche les détails d'un utilisateur
 * 
 * @param params - Paramètre de route contenant l'ID de l'utilisateur
 */
export default async function UtilisateurDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUserById(id);

  // Affiche la page 404 si l'utilisateur n'existe pas
  if (!user) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6 sm:py-8 md:py-10 px-4 space-y-6 sm:space-y-8">
      {/* Bouton de retour */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/utilisateur">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour à la liste
          </Link>
        </Button>
      </div>

      {/* En-tête avec titre */}
      <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
        <div className="flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          <Title level="h1">{user.name}</Title>
        </div>
        <Text size="lg" className="text-muted-foreground">
          Détails du profil utilisateur
        </Text>
      </div>

      {/* Card avec les informations de l'utilisateur */}
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Informations du profil</CardTitle>
            <CardDescription>
              Données de l'utilisateur enregistrées dans le système.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Email */}
            <div className="flex items-start gap-4">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <Text className="font-medium">Email</Text>
                <Text className="text-muted-foreground">{user.email}</Text>
              </div>
            </div>

            {/* Date de création */}
            <div className="flex items-start gap-4">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <Text className="font-medium">Date de création</Text>
                <Text className="text-muted-foreground">
                  {new Date(user.createdAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </div>
            </div>

            {/* Date de mise à jour */}
            <div className="flex items-start gap-4">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <Text className="font-medium">Dernière mise à jour</Text>
                <Text className="text-muted-foreground">
                  {new Date(user.updatedAt).toLocaleDateString("fr-FR", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
              <Button variant="outline" className="flex-1">
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </Button>
              <Button variant="destructive" className="flex-1">
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
