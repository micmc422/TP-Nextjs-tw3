import { PackageExplanation } from "@/app/packages/PackageExplanation";
import { Button } from "@workspace/ui/components/button";
import Link from "next/link";
import { Title } from "@/components/Title";

export default function PackagesPage() {
  return (
    <div className="flex flex-col items-center min-h-svh py-20 gap-10">
      <div className="w-full max-w-5xl px-6">
        <div className="mb-8">
            <Link href="/">
                <Button variant="outline" size="sm">← Retour à l'accueil</Button>
            </Link>
        </div>
        
        <Title level="homepage" className="mb-12">Gestion des Packages</Title>
        
        <PackageExplanation />
      </div>
    </div>
  );
}
