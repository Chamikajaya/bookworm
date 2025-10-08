import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterSearchBar } from "./FilterSearchBar";
import { BOOK_CATEGORIES, SORT_OPTIONS } from "@/constants/constants";
import type { BookCategory, SortBy, SortOrder } from "@/types/bookTypes";

interface DesktopFiltersProps {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  author: string;
  setAuthor: (value: string) => void;
  category: BookCategory | "all";
  setCategory: (value: BookCategory | "all") => void;
  minPrice: string;
  setMinPrice: (value: string) => void;
  maxPrice: string;
  setMaxPrice: (value: string) => void;
  sortBy: `${SortBy}-${SortOrder}`;
  setSortBy: (value: `${SortBy}-${SortOrder}`) => void;
  applyFilters: () => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  activeFilterCount: number;
}

export const DesktopFilters = ({
  searchQuery,
  setSearchQuery,
  author,
  setAuthor,
  category,
  setCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sortBy,
  setSortBy,
  applyFilters,
  clearFilters,
  hasActiveFilters,
  activeFilterCount,
}: DesktopFiltersProps) => {
  return (
    <div className="hidden lg:block space-y-4">
      {/* Search Bar and Sort */}
      <div className="flex gap-4">
        <FilterSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onEnter={applyFilters}
          placeholder="Search by title..."
          className="flex-1"
        />
        <Select
          value={sortBy}
          onValueChange={(value) =>
            setSortBy(value as `${SortBy}-${SortOrder}`)
          }
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Author</Label>
          <Input
            placeholder="Search by author..."
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>

        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={category}
            onValueChange={(value) =>
              setCategory(value as BookCategory | "all")
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {BOOK_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Min Price ($)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="0.00"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>

        <div className="space-y-2">
          <Label>Max Price ($)</Label>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="999.99"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Button onClick={applyFilters}>Apply Filters</Button>
          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="outline">
              Clear All
            </Button>
          )}
        </div>
        {hasActiveFilters && (
          <span className="text-sm text-muted-foreground">
            {activeFilterCount} filter{activeFilterCount !== 1 ? "s" : ""}{" "}
            active
          </span>
        )}
      </div>
    </div>
  );
};
