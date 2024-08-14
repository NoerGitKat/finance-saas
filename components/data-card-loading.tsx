import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export const DataCardLoading = () => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-x-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="size-12" />
      </CardHeader>
      <CardContent>
        <Skeleton className="mb-2 h-10 w-24 shrink-0" />
        <Skeleton className="h-4 w-40 shrink-0" />
      </CardContent>
    </Card>
  );
};
