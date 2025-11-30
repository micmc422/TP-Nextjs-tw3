import type { Metadata } from "next"
import { ProjectStructure } from "@/components/ProjectStructure"
import { Text } from "@/components/Text"
import { Title } from "@/components/Title"
import { MonorepoAdvantages } from "@/app/MonorepoAdvantages"
import { TurboJsonExplanation } from "@/app/TurboJsonExplanation"
import { Button } from "@workspace/ui/components/button"

export const metadata: Metadata = {
  title: "Accueil",
  description: "Bienvenue dans cette application Next.js avancée avec une configuration monorepo et des composants réutilisables. Découvrez l'architecture moderne avec Turborepo.",
  openGraph: {
    title: "Next.js Avancé | Monorepo TP",
    description: "Bienvenue dans cette application Next.js avancée avec une configuration monorepo et des composants réutilisables.",
  },
};

export default function Page() {
  return (
    <div className="flex flex-col items-center min-h-svh py-20 gap-20">
      {/* Hero Section */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 w-full max-w-7xl px-6">
        <div className="flex flex-col items-center lg:items-start justify-center gap-6 max-w-xl text-center lg:text-left">
          <Title level="homepage">Next.js Avancé</Title>
          <Text size="lead">
            Bienvenue dans cette application Next.js avancée avec une configuration
            monorepo et des composants réutilisables !
          </Text>
          <div className="flex gap-4">
             <Button variant="default">Commencer le TP</Button>
             <Button variant="outline">Documentation</Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-4 w-full max-w-md">
          <ProjectStructure className="w-full shadow-xl rounded-xl border bg-card" />
        </div>
      </div>

      {/* Educational Section */}
      <div className="w-full max-w-7xl px-6 space-y-20">
        <MonorepoAdvantages />
        <TurboJsonExplanation />
      </div>
    </div>
  )
}
