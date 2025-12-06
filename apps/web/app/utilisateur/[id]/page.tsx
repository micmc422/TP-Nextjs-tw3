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
 * - Server Actions pour les opérations CRUD
 * 
 * URL exemple : /utilisateur/1 → params.id = "1"
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Title } from "@/components/Title";
import { Text } from "@/components/Text";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { User } from "lucide-react";
import { getUserById } from "./data";
import { UserEditForm } from "./components/UserEditForm";
import { UserDetailView } from "./components/UserDetailView";

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
 * @param searchParams - Paramètres de recherche pour le mode édition
 */
export default async function UtilisateurDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ edit?: string }>;
}) {
  const { id } = await params;
  const { edit } = await searchParams;
  const isEditing = edit === "true";
  const user = await getUserById(id);

  // Affiche la page 404 si l'utilisateur n'existe pas
  if (!user) {
    notFound();
  }

  return (
    <>
      {/* En-tête avec titre */}
      <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
        <div className="flex items-center gap-3">
          <User className="h-8 w-8 text-primary" />
          <Title level="h1">{user.name}</Title>
        </div>
        <Text size="lg" className="text-muted-foreground">
          {isEditing ? "Modifier le profil utilisateur" : "Détails du profil utilisateur"}
        </Text>
      </div>

      {/* Card avec les informations de l'utilisateur */}
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Informations du profil</CardTitle>
            <CardDescription>
              {isEditing 
                ? "Modifiez les informations de l'utilisateur ci-dessous."
                : "Données de l'utilisateur enregistrées dans le système."
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isEditing ? (
              <UserEditForm user={user} />
            ) : (
              <UserDetailView user={user} />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
