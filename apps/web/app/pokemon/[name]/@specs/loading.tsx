import { Skeleton } from "@workspace/ui/components/skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-baseline gap-4 flex-wrap">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-4 w-32 mt-2" />

        <div className="flex gap-8 mt-4 text-sm flex-wrap">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-20 w-full" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-64 w-full" />
      </div>

      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
      </div>
    </div>
  );
}
