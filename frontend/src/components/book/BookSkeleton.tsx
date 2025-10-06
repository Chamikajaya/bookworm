import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export const BookSkeleton = () => {
  return (
    <Card>
      <CardHeader className="p-0">
        <Skeleton className="aspect-[2/3] rounded-t-lg" />
      </CardHeader>
      <CardContent className="p-4">
        <Skeleton className="h-6 w-3/4 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-2" />
        <Skeleton className="h-5 w-16" />
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Skeleton className="h-6 w-20" />
      </CardFooter>
    </Card>
  );
};
