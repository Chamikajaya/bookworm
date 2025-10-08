import { Badge } from "@/components/ui/badge";
import type { BookCategory } from "@/types/bookTypes";

interface ActiveFilterBadgesProps {
  searchQuery: string;
  author: string;
  category: BookCategory | "all";
  minPrice: string;
  maxPrice: string;
  hasActiveFilters: boolean;
}

export const ActiveFilterBadges = ({
  searchQuery,
  author,
  category,
  minPrice,
  maxPrice,
  hasActiveFilters,
}: ActiveFilterBadgesProps) => {
  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {searchQuery && (
        <Badge variant="secondary" className="gap-1">
          Title: {searchQuery}
        </Badge>
      )}
      {author && (
        <Badge variant="secondary" className="gap-1">
          Author: {author}
        </Badge>
      )}
      {category !== "all" && (
        <Badge variant="secondary" className="gap-1">
          Category: {category}
        </Badge>
      )}
      {minPrice && (
        <Badge variant="secondary" className="gap-1">
          Min: ${minPrice}
        </Badge>
      )}
      {maxPrice && (
        <Badge variant="secondary" className="gap-1">
          Max: ${maxPrice}
        </Badge>
      )}
    </div>
  );
};
