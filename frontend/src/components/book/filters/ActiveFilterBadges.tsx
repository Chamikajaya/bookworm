import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BookCategory } from "@/types/bookTypes";

interface ActiveFilterBadgesProps {
  searchQuery: string;
  author: string;
  category: BookCategory | "all";
  minPrice: string;
  maxPrice: string;
  hasActiveFilters: boolean;
  onRemoveFilter: (filterKey: FilterKey) => void;
}

type FilterKey = "title" | "author" | "category" | "minPrice" | "maxPrice";

export const ActiveFilterBadges = ({
  searchQuery,
  author,
  category,
  minPrice,
  maxPrice,
  hasActiveFilters,
  onRemoveFilter,
}: ActiveFilterBadgesProps) => {
  if (!hasActiveFilters) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {searchQuery && (
        <Badge
          variant="secondary"
          className="gap-1 cursor-pointer hover:bg-secondary/80 transition-colors"
          onClick={() => onRemoveFilter("title")}
        >
          Title: {searchQuery}
          <X className="h-3 w-3" />
        </Badge>
      )}
      {author && (
        <Badge
          variant="secondary"
          className="gap-1 cursor-pointer hover:bg-secondary/80 transition-colors"
          onClick={() => onRemoveFilter("author")}
        >
          Author: {author}
          <X className="h-3 w-3" />
        </Badge>
      )}
      {category !== "all" && (
        <Badge
          variant="secondary"
          className="gap-4 cursor-pointer hover:bg-secondary/80 transition-colors"
          onClick={() => onRemoveFilter("category")}
        >
          Category: {category}
          <X className="h-3 w-3" />
        </Badge>
      )}
      {minPrice && (
        <Badge
          variant="secondary"
          className="gap-1 cursor-pointer hover:bg-secondary/80 transition-colors"
          onClick={() => onRemoveFilter("minPrice")}
        >
          Min: ${minPrice}
          <X className="h-3 w-3" />
        </Badge>
      )}
      {maxPrice && (
        <Badge
          variant="secondary"
          className="gap-1 cursor-pointer hover:bg-secondary/80 transition-colors"
          onClick={() => onRemoveFilter("maxPrice")}
        >
          Max: ${maxPrice}
          <X className="h-3 w-3" />
        </Badge>
      )}
    </div>
  );
};
