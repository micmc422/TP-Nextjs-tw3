import { Title } from "@/components/Title";
import { Text } from "@/components/Text";

const advantages = [
  {
    title: "Partage de Code Simplifié",
    description: "Partagez facilement des composants UI, des fonctions utilitaires et des types TypeScript entre plusieurs applications (Web, Mobile, API) sans duplication de code.",
  },
  {
    title: "Gestion Unifiée des Dépendances",
    description: "Gérez vos librairies (React, TypeScript, etc.) en un seul endroit. Cela évite les conflits de versions et simplifie les mises à jour pour tous les projets simultanément.",
  },
  {
    title: "Cohérence des Outils (Tooling)",
    description: "Utilisez une configuration unique pour vos outils de qualité (ESLint, Prettier, Tests) sur l'ensemble de vos projets, garantissant un standard de code uniforme.",
  },
  {
    title: "Refactoring Atomique",
    description: "Modifiez une librairie partagée et mettez à jour instantanément toutes les applications qui l'utilisent en un seul commit, sans casser l'intégration.",
  },
];

export function MonorepoAdvantages() {
  return (
    <section className="py-10 space-y-6 ">
      <div className="space-y-4">
        <Title level="h2">Pourquoi cette structure Monorepo ?</Title>
        <Text size="lg">
          Bienvenue dans l'architecture Monorepo. Contrairement à l'approche "Multirepo" (un dépôt par projet),
          ici nous regroupons plusieurs projets (apps) et librairies partagées (packages) dans un <strong>seul dépôt Git</strong>.
        </Text>
        <Text>
          C'est une structure standard dans l'industrie (utilisée par Google, Meta, Microsoft) qui facilite grandement
          le développement d'applications complexes. Voici les concepts clés à retenir pour ce début de module :
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {advantages.map((adv, index) => (
          <div
            key={index}
            className="p-6 border rounded-xl shadow-sm bg-card text-card-foreground hover:shadow-md transition-shadow"
          >
            <Title level="h3">{adv.title}</Title>
            <Text size="sm">{adv.description}</Text>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-muted">
        <Text size="sm" className="italic text-muted-foreground !mt-0">
          ℹ️ Note pour les étudiants : Ne vous inquiétez pas si tout n'est pas clair immédiatement.
          Nous détaillerons la configuration technique (Turborepo, pnpm workspaces) au fur et à mesure des TPs.
          Pour l'instant, concentrez-vous sur la structure des dossiers <code>apps/</code> et <code>packages/</code>.
        </Text>
      </div>
    </section>
  );
}
