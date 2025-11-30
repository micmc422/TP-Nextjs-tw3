import { Title } from "@/components/Title";
import { Text } from "@/components/Text";

const turboFeatures = [
  {
    title: "Orchestration des Tâches",
    description: "Le fichier turbo.json définit le 'pipeline' de votre projet. Il indique à Turborepo comment exécuter les scripts (build, lint, dev) et dans quel ordre, en respectant les dépendances entre vos applications et packages.",
  },
  {
    title: "Mise en Cache Intelligente",
    description: "Turborepo mémorise les résultats de vos commandes. Si vous relancez une tâche sans avoir modifié le code, il restitue le résultat instantanément (cache hit) au lieu de tout recalculer, gagnant un temps précieux.",
  },
  {
    title: "Exécution Parallèle",
    description: "Grâce à sa compréhension du graphe de dépendances, Turborepo peut lancer plusieurs tâches simultanément sur différents cœurs de votre processeur, accélérant considérablement les temps de build et de test.",
  },
  {
    title: "Configuration Déclarative",
    description: "Tout se passe dans ce fichier JSON. Vous y définissez les entrées (inputs) et sorties (outputs) de chaque tâche, permettant à l'outil de savoir exactement quand invalider le cache.",
  },
];

export function TurboJsonExplanation() {
  return (
    <section className="py-10 space-y-6">
      <div className="space-y-4">
        <Title level="h2">Le Cerveau du Monorepo : turbo.json</Title>
        <Text size="lg">
          Si le dossier <code>apps/</code> et <code>packages/</code> est le corps de notre monorepo, le fichier <code>turbo.json</code> en est le cerveau.
          C'est le fichier de configuration de <strong>Turborepo</strong>, l'outil qui pilote notre environnement de développement.
        </Text>
        <Text>
          Il permet de transformer une collection de projets isolés en un système cohérent et performant.
          Voici comment il optimise votre flux de travail au quotidien :
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {turboFeatures.map((feature, index) => (
          <div
            key={index}
            className="p-6 border rounded-xl shadow-sm bg-card text-card-foreground hover:shadow-md transition-shadow"
          >
            <Title level="h3">{feature.title}</Title>
            <Text size="sm">{feature.description}</Text>
          </div>
        ))}
      </div>

      <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-muted">
        <Text size="sm" className="italic text-muted-foreground !mt-0">
          🚀 Astuce : Jetez un œil au fichier <code>turbo.json</code> à la racine du projet. 
          Vous verrez la clé <code>"pipeline"</code> (ou <code>"tasks"</code>) qui configure par exemple que la tâche <code>build</code> dépend du build des dépendances (<code>^build</code>).
        </Text>
      </div>
    </section>
  );
}
