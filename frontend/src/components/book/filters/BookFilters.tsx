import { DesktopFilters } from "./DesktopFilters";
import { MobileFilters } from "./MobileFilters";
import { ActiveFilterBadges } from "./ActiveFilterBadges";
import { useBookFilters } from "@/hooks/useBookFilters";

interface BookFiltersProps {
  onFiltersChange?: () => void;
}

export const BookFilters = ({ onFiltersChange }: BookFiltersProps) => {
  const {
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
    removeFilter,
    hasActiveFilters,
    activeFilterCount,
  } = useBookFilters();

  const handleApplyFilters = () => {
    applyFilters();
    onFiltersChange?.();
  };

  const handleClearFilters = () => {
    clearFilters();
    onFiltersChange?.();
  };

  const handleRemoveFilter = (
    filterKey: "title" | "author" | "category" | "minPrice" | "maxPrice"
  ) => {
    removeFilter(filterKey);
    onFiltersChange?.();
  };

  const filterProps = {
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
    applyFilters: handleApplyFilters,
    clearFilters: handleClearFilters,
    hasActiveFilters,
    activeFilterCount,
  };

  return (
    <div className="space-y-4">
      <DesktopFilters {...filterProps} />
      <MobileFilters {...filterProps} />
      <ActiveFilterBadges
        searchQuery={searchQuery}
        author={author}
        category={category}
        minPrice={minPrice}
        maxPrice={maxPrice}
        hasActiveFilters={hasActiveFilters}
        onRemoveFilter={handleRemoveFilter}
      />
    </div>
  );
};
