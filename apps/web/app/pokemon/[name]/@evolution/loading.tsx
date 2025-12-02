import { Card, CardHeader, CardTitle, CardContent } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

export default function Loading() {
  return (
    <Card className="p-6 mb-8">
      <CardHeader className="p-0 pb-4">
        <CardTitle>Chaîne d&apos;évolution</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-wrap items-center justify-center gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="flex flex-col items-center p-4">
                <Skeleton className="w-20 h-20 mb-2 rounded-full" />
                <Skeleton className="h-4 w-16" />
              </div>
              {i < 3 && (
                <span className="text-2xl text-muted-foreground">→</span>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
