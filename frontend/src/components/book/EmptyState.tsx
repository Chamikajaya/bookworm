import { BookOpen } from "lucide-react";

export const EmptyState = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <BookOpen className="w-16 h-16 text-muted-foreground mb-4" />
      <h3 className="text-xl font-semibold mb-2">No books found</h3>
      <p className="text-muted-foreground text-center max-w-md">
        We couldn't find any books matching your criteria. Try adjusting your
        filters.
      </p>
    </div>
  );
};
