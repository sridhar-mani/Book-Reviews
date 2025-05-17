export function BookCardSkeleton() {
  return (
    <div className="h-full rounded-lg border bg-card text-card-foreground shadow animate-pulse">
      <div className="p-6">
        <div className="aspect-[2/3] bg-muted rounded-md mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-muted rounded w-3/4"></div>
          <div className="h-3 bg-muted rounded w-1/2"></div>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-4 h-4 bg-muted rounded"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}