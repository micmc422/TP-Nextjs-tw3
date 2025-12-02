import type { Metadata } from "next"
import { Title } from "@/components/Title"
import { Text } from "@/components/Text"
import { PokemonCreatorForm } from "./PokemonCreatorForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card"
import { Code, Zap, Loader, FileText, FormInput, Server } from "lucide-react"

export const metadata: Metadata = {
  title: "Créateur de Pokémon",
  description:
    "Créez votre propre Pokémon inventé et générez un PDF avec ses informations. Démonstration des bonnes pratiques de formulaires avec Next.js.",
  keywords: ["Pokémon", "créateur", "formulaire", "PDF", "Next.js", "server actions"],
  openGraph: {
    title: "Créateur de Pokémon | Next.js Avancé",
    description: "Créez votre propre Pokémon inventé et générez un PDF avec ses informations.",
  },
}

export default function PokemonCreatePage() {
  return (
    <div className="container mx-auto py-6 sm:py-8 md:py-10 px-4 space-y-8 sm:space-y-10">
      {/* En-tête */}
      <div className="flex flex-col items-center text-center space-y-4">
        <Title level="h1">Créateur de Pokémon</Title>
        <Text size="lg" className="max-w-2xl">
          Inventez votre propre Pokémon et générez un PDF professionnel avec toutes ses
          caractéristiques. Ce formulaire démontre les bonnes pratiques Next.js.
        </Text>
      </div>

      {/* Explication pédagogique */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Server className="h-4 w-4 text-primary" />
              Server Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Le formulaire utilise les Server Actions de Next.js pour traiter les données
              directement côté serveur de manière sécurisée.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Zap className="h-4 w-4 text-primary" />
              useTransition
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Le hook useTransition permet de gérer les états de chargement sans bloquer
              l&apos;interface utilisateur pendant la soumission.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Loader className="h-4 w-4 text-primary" />
              useOptimistic
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              useOptimistic offre un feedback visuel immédiat à l&apos;utilisateur avant même
              que le serveur ne réponde.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <FormInput className="h-4 w-4 text-primary" />
              Validation Zod
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              La validation côté serveur utilise Zod pour garantir l&apos;intégrité des
              données avec des messages d&apos;erreur clairs.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-primary" />
              Génération PDF
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              jsPDF génère un PDF personnalisé avec les informations du Pokémon,
              stylisé selon le type choisi.
            </CardDescription>
          </CardContent>
        </Card>

        <Card className="border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Code className="h-4 w-4 text-primary" />
              Package Form
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              Le package @workspace/form fournit des hooks et composants réutilisables
              pour la gestion des formulaires.
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Formulaire principal */}
      <div className="max-w-3xl mx-auto">
        <PokemonCreatorForm />
      </div>

      {/* Note sur l'accessibilité */}
      <div className="max-w-3xl mx-auto">
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-base">💡 Bonnes pratiques implémentées</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <ul className="list-disc list-inside space-y-1">
              <li>
                <strong>Accessibilité</strong> : Labels associés, messages d&apos;erreur
                avec aria-invalid et aria-describedby
              </li>
              <li>
                <strong>Validation</strong> : Validation côté serveur avec Zod,
                messages d&apos;erreur par champ
              </li>
              <li>
                <strong>UX</strong> : États de chargement, feedback optimiste,
                désactivation pendant la soumission
              </li>
              <li>
                <strong>Performance</strong> : useTransition pour ne pas bloquer l&apos;UI,
                composants contrôlés
              </li>
              <li>
                <strong>Sécurité</strong> : Server Actions avec validation côté serveur,
                pas de logique sensible côté client
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
