import { Title } from "@/components/Title";
import { Text } from "@/components/Text";

const steps = [
  {
    title: "1. Structure du Package",
    description: "Le package UI est situé dans `packages/ui`. Il contient ses propres configurations (package.json, tsconfig.json) et son code source dans `src/`. C'est un mini-projet indépendant au sein du monorepo.",
  },
  {
    title: "2. Définition des Exports",
    description: "Le fichier `package.json` de `@workspace/ui` définit ce qui est accessible depuis l'extérieur via le champ `exports`. Par exemple, `./components/*` pointe vers `./src/components/*.tsx`.",
  },
  {
    title: "3. Installation dans l'App",
    description: "Pour utiliser le package dans `apps/web`, on l'ajoute aux dépendances : `\"@workspace/ui\": \"workspace:*\"`. Le protocole `workspace:*` assure qu'on utilise toujours la version locale la plus récente.",
  },
  {
    title: "4. Import et Utilisation",
    description: "Une fois lié, vous pouvez importer les composants comme s'il s'agissait d'une librairie externe npm : `import { Button } from \"@workspace/ui/components/button\"`.",
  },
];

export function PackageExplanation() {
  return (
    <section className="py-10 space-y-6">
      <div className="space-y-4">
        <Title level="h2">Comprendre et Utiliser le Package UI</Title>
        <Text size="lg">
          L'un des plus grands atouts de notre monorepo est la capacité d'isoler le code réutilisable dans des "packages".
          Prenons l'exemple de notre dossier <code>packages/ui</code> qui contient nos composants graphiques partagés.
        </Text>
        <Text>
          Au lieu de copier-coller des boutons et des champs de texte d'un projet à l'autre, nous les centralisons ici.
          Voici comment cela fonctionne sous le capot :
        </Text>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="p-6 border rounded-xl shadow-sm bg-card text-card-foreground hover:shadow-md transition-shadow"
          >
            <Title level="h3">{step.title}</Title>
            <Text size="sm">
                {/* Rendu basique du markdown inline pour le code */}
                {step.description.split('`').map((part, i) => 
                    i % 2 === 1 ? <code key={i} className="bg-muted px-1 py-0.5 rounded font-mono text-xs">{part}</code> : part
                )}
            </Text>
          </div>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        <Title level="h3">Exemple Concret : package.json</Title>
        <div className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto font-mono text-sm border border-slate-800">
<pre>{`// packages/ui/package.json
{
  "name": "@workspace/ui",
  "exports": {
    "./components/*": "./src/components/*.tsx",
    "./lib/*": "./src/lib/*.ts"
  }
}`}</pre>
        </div>
        <Text size="sm" className="text-muted-foreground">
            Grâce à cette configuration, TypeScript et Node.js savent exactement où trouver le code lorsque vous faites un import.
        </Text>
      </div>
    </section>
  );
}
