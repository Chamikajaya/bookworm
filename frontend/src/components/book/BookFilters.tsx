import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, X } from "lucide-react";
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
import type { BookCategory, SortBy, SortOrder } from "@/types/bookTypes";

const BOOK_CATEGORIES: BookCategory[] = [
  "Fiction",
  "Non-Fiction",
  "Science",
  "History",
  "Biography",
  "Children",
  "Fantasy",
  "Mystery",
  "Romance",
  "Self-Help",
  "Health",
];

const SORT_OPTIONS = [
  { value: "updatedAt-desc", label: "Newest First" },
  { value: "updatedAt-asc", label: "Oldest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
] as const;

interface BookFiltersProps {
  onFiltersChange?: () => void;
}

export const BookFilters = ({ onFiltersChange }: BookFiltersProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  // State for all filters
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("title") || ""
  );
  const [author, setAuthor] = useState(searchParams.get("author") || "");
  const [category, setCategory] = useState<BookCategory | "all">(
    (searchParams.get("category") as BookCategory) || "all"
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sortBy, setSortBy] = useState<`${SortBy}-${SortOrder}`>(
    `${searchParams.get("sortBy") || "updatedAt"}-${
      searchParams.get("sortOrder") || "desc"
    }` as `${SortBy}-${SortOrder}`
  );

  // Sync state with URL on mount and URL changes
  useEffect(() => {
    setSearchQuery(searchParams.get("title") || "");
    setAuthor(searchParams.get("author") || "");
    setCategory((searchParams.get("category") as BookCategory) || "all");
    setMinPrice(searchParams.get("minPrice") || "");
    setMaxPrice(searchParams.get("maxPrice") || "");
    setSortBy(
      `${searchParams.get("sortBy") || "updatedAt"}-${
        searchParams.get("sortOrder") || "desc"
      }` as `${SortBy}-${SortOrder}`
    );
  }, [searchParams]);

  const applyFilters = () => {
    const params: Record<string, string> = { page: "1" };

    if (searchQuery.trim()) params.title = searchQuery.trim();
    if (author.trim()) params.author = author.trim();
    if (category !== "all") params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    const [sortByValue, sortOrderValue] = sortBy.split("-") as [
      SortBy,
      SortOrder
    ];
    params.sortBy = sortByValue;
    params.sortOrder = sortOrderValue;

    setSearchParams(params);
    setIsOpen(false);
    onFiltersChange?.();
  };

  const clearFilters = () => {
    setSearchQuery("");
    setAuthor("");
    setCategory("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("updatedAt-desc");
    setSearchParams({ page: "1", sortBy: "updatedAt", sortOrder: "desc" });
    setIsOpen(false);
    onFiltersChange?.();
  };

  const hasActiveFilters =
    searchQuery ||
    author ||
    category !== "all" ||
    minPrice ||
    maxPrice ||
    sortBy !== "updatedAt-desc";

  const activeFilterCount = [
    searchQuery,
    author,
    category !== "all",
    minPrice,
    maxPrice,
    sortBy !== "updatedAt-desc",
  ].filter(Boolean).length;

  return (
    <div className="space-y-4">
      {/* Desktop View - Always Visible */}
      <div className="hidden lg:block space-y-4">
        {/* Search Bar and Sort */}
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              className="pl-9"
            />
          </div>
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

      {/* Mobile/Tablet View - Sheet */}
      <div className="lg:hidden">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
              className="pl-9"
            />
          </div>
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

              <div className="space-y-6 mt-6">
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
                        step="0.01"
                        placeholder="0.00"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">
                        Max ($)
                      </Label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="999.99"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2 pt-4">
                  <Button onClick={applyFilters} className="w-full">
                    Apply Filters
                  </Button>
                  {hasActiveFilters && (
                    <Button
                      onClick={clearFilters}
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

      {/* Active Filters Display */}
      {hasActiveFilters && (
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
      )}
    </div>
  );
};
