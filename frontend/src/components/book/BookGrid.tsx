import { useEffect } from "react";
import { useGetBooksQuery } from "@/api/booksApi";
import { BookFilters } from "./BookFilters";
import { BookGridContent } from "./BookGridContent";
import { BookPagination } from "./BookPagination";
import { BookSkeleton } from "./BookSkeleton";
import { EmptyState } from "./EmptyState";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { usePaginationState } from "@/hooks/usePaginationState";
import { useBookFilters } from "@/hooks/useBookFilters";

const ITEMS_PER_PAGE = 12;

export const BookGrid = () => {
  const {
    currentPage,
    setCurrentPage,
    pageKeys,
    maxKnownPage,
    resetPagination,
    updatePageKeys,
    updateUrl,
  } = usePaginationState();

  const { filters, checkFiltersChanged, updateFiltersRef } = useBookFilters();

  // Reset pagination when filters change
  useEffect(() => {
    if (checkFiltersChanged()) {
      resetPagination();
      updateFiltersRef();
    }
  }, [
    filters.title,
    filters.author,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.sortBy,
    filters.sortOrder,
  ]);

  const { data, isLoading, isFetching, error } = useGetBooksQuery({
    limit: ITEMS_PER_PAGE,
    lastKey: pageKeys[currentPage],
    ...filters,
  });

  // Update page keys when data changes
  useEffect(() => {
    if (data) {
      updatePageKeys(data.hasMore, data.lastEvaluatedKey);
    }
  }, [data, currentPage]);

  const handlePageChange = (page: number) => {
    if (page !== currentPage && page <= maxKnownPage) {
      setCurrentPage(page);
      updateUrl(page);
    }
  };

  const handleNextPage = () => {
    if (data?.hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      updateUrl(nextPage);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      setCurrentPage(prevPage);
      updateUrl(prevPage);
    }
  };

  // Initial loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <BookFilters onFiltersChange={resetPagination} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <BookSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-8">
        <BookFilters onFiltersChange={resetPagination} />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load books. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Empty state
  if (!data?.items || data.items.length === 0) {
    return (
      <div className="space-y-8">
        <BookFilters onFiltersChange={resetPagination} />
        <EmptyState />
      </div>
    );
  }

  const hasNextPage = data?.hasMore ?? false;
  const hasPreviousPage = currentPage > 1;

  return (
    <div className="space-y-8">
      <BookFilters onFiltersChange={resetPagination} />

      <BookGridContent
        books={data.items}
        isFetching={isFetching}
        itemsPerPage={ITEMS_PER_PAGE}
      />

      <BookPagination
        currentPage={currentPage}
        maxKnownPage={maxKnownPage}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        onPageChange={handlePageChange}
        onNextPage={handleNextPage}
        onPreviousPage={handlePreviousPage}
      />

      <div className="text-center text-sm text-muted-foreground">
        Showing page {currentPage} of {maxKnownPage}
        {hasNextPage && "+"} • {data.count} books on this page
        {!hasNextPage && <span> • End of results</span>}
      </div>
    </div>
  );
};
