import { Card } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-2">
        <div className="bg-muted/30 p-8 flex justify-center items-center aspect-square relative">
          <Skeleton className="w-full h-full rounded-xl" />
        </div>
      </Card>

      <div className="flex gap-2 justify-center">
        <Skeleton className="h-8 w-20 rounded-full" />
        <Skeleton className="h-8 w-20 rounded-full" />
      </div>

      <Card className="p-4">
        <div className="flex justify-center gap-4">
           <Skeleton className="w-24 h-24" />
           <Skeleton className="w-24 h-24" />
        </div>
      </Card>
    </div>
  );
}
