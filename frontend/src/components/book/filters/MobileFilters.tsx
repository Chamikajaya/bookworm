import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { FilterSearchBar } from "./FilterSearchBar";
import { BOOK_CATEGORIES, SORT_OPTIONS } from "@/constants/constants";
import type { BookCategory, SortBy, SortOrder } from "@/types/bookTypes";

interface MobileFiltersProps {
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

export const MobileFilters = ({
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
}: MobileFiltersProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleApplyFilters = () => {
    applyFilters();
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    clearFilters();
    setIsOpen(false);
  };

  return (
    <div className="lg:hidden">
      <div className="flex gap-2">
        <FilterSearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          onEnter={handleApplyFilters}
          placeholder="Search books..."
          className="flex-1"
        />
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <SlidersHorizontal className="h-4 w-4" />
              {activeFilterCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full sm:max-w-lg overflow-y-auto"
          >
            <SheetHeader>
              <SheetTitle>Filters & Sort</SheetTitle>
              <SheetDescription>
                Refine your book search with filters and sorting options
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 mt-6 p-4">
              {/* Sort */}
              <div className="space-y-2">
                <Label>Sort By</Label>
                <Select
                  value={sortBy}
                  onValueChange={(value) =>
                    setSortBy(value as `${SortBy}-${SortOrder}`)
                  }
                >
                  <SelectTrigger>
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

              {/* Author */}
              <div className="space-y-2">
                <Label>Author</Label>
                <Input
                  placeholder="Search by author..."
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>

              {/* Category */}
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

              {/* Price Range */}
              <div className="space-y-4">
                <Label>Price Range</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Min ($)
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0.00"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">
                      Max ($)
                    </Label>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      placeholder="999.99"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-4">
                <Button onClick={handleApplyFilters} className="w-full">
                  Apply Filters
                </Button>
                {hasActiveFilters && (
                  <Button
                    onClick={handleClearFilters}
                    variant="outline"
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
