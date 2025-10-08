import { DesktopFilters } from "./filters/DesktopFilters";
import { MobileFilters } from "./filters/MobileFilters";
import { ActiveFilterBadges } from "./filters/ActiveFilterBadges";
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
      />
    </div>
  );
};
