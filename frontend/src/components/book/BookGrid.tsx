import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useGetBooksQuery } from "@/api/booksApi";
import { BookCard } from "./BookCard";
import { BookSkeleton } from "./BookSkeleton";
import { EmptyState } from "./EmptyState";
import { BookFilters } from "./BookFilters";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AlertCircle } from "lucide-react";
import type { BookCategory, SortBy, SortOrder } from "@/types/bookTypes";

export const BookGrid = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);

  const [currentPage, setCurrentPage] = useState(pageFromUrl);
  const [pageKeys, setPageKeys] = useState<Record<number, string | undefined>>({
    1: undefined,
  });

  const itemsPerPage = 12;

  // Extract all search params
  const title = searchParams.get("title") || undefined;
  const author = searchParams.get("author") || undefined;
  const category = searchParams.get("category") as BookCategory | undefined;
  const minPrice = searchParams.get("minPrice")
    ? parseFloat(searchParams.get("minPrice")!)
    : undefined;
  const maxPrice = searchParams.get("maxPrice")
    ? parseFloat(searchParams.get("maxPrice")!)
    : undefined;
  const sortBy = (searchParams.get("sortBy") || "updatedAt") as SortBy;
  const sortOrder = (searchParams.get("sortOrder") || "desc") as SortOrder;

  // Sync currentPage with URL
  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page") || "1", 10);
    if (urlPage !== currentPage) {
      setCurrentPage(urlPage);
    }
  }, [searchParams]);

  const { data, isLoading, isFetching, error } = useGetBooksQuery({
    limit: itemsPerPage,
    lastKey: pageKeys[currentPage],
    title,
    author,
    category,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
  });

  // Reset pagination when filters change
  const handleFiltersChange = () => {
    setCurrentPage(1);
    setPageKeys({ 1: undefined });
  };

  // Update page keys when data changes
  useEffect(() => {
    if (data?.lastEvaluatedKey && data?.hasMore) {
      setPageKeys((prev) => ({
        ...prev,
        [currentPage + 1]: data.lastEvaluatedKey,
      }));
    }
  }, [data, currentPage]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
    scrollToTop();
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

  const handlePageClick = (page: number) => {
    if (page !== currentPage && pageKeys[page] !== undefined) {
      setCurrentPage(page);
      updateUrl(page);
    }
  };

  // Initial loading state
  if (isLoading) {
    return (
      <div className="space-y-8">
        <BookFilters onFiltersChange={handleFiltersChange} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: itemsPerPage }).map((_, i) => (
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
        <BookFilters onFiltersChange={handleFiltersChange} />
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
        <BookFilters onFiltersChange={handleFiltersChange} />
        <EmptyState />
      </div>
    );
  }

  // Calculate pagination display
  const totalPagesKnown = Object.keys(pageKeys).length;
  const hasNextPage = data?.hasMore ?? false;
  const hasPreviousPage = currentPage > 1;

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (totalPagesKnown <= maxVisiblePages) {
      for (let i = 1; i <= totalPagesKnown; i++) {
        pages.push(i);
      }
      if (hasNextPage && currentPage === totalPagesKnown) {
        pages.push(totalPagesKnown + 1);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4);
        if (hasNextPage || totalPagesKnown > 4) {
          pages.push(5);
        }
      } else if (currentPage >= totalPagesKnown - 2) {
        for (let i = totalPagesKnown - 4; i <= totalPagesKnown; i++) {
          if (i > 0) pages.push(i);
        }
        if (hasNextPage && currentPage === totalPagesKnown) {
          pages.push(totalPagesKnown + 1);
        }
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="space-y-8">
      {/* Filters */}
      <BookFilters onFiltersChange={handleFiltersChange} />

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isFetching
          ? Array.from({ length: itemsPerPage }).map((_, i) => (
              <BookSkeleton key={`loading-${i}`} />
            ))
          : data.items.map((book) => <BookCard key={book.id} book={book} />)}
      </div>

      {/* Pagination Controls */}
      {(totalPagesKnown > 1 || hasNextPage) && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={handlePreviousPage}
                className={
                  !hasPreviousPage
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                aria-disabled={!hasPreviousPage}
              />
            </PaginationItem>

            {currentPage > 3 && totalPagesKnown > 5 && (
              <>
                <PaginationItem>
                  <PaginationLink
                    onClick={() => handlePageClick(1)}
                    className="cursor-pointer"
                  >
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              </>
            )}

            {pageNumbers.map((page) => {
              const isKnownPage = pageKeys[page] !== undefined;
              const isCurrentPage = currentPage === page;
              const isClickable = isKnownPage || page === currentPage;

              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => isClickable && handlePageClick(page)}
                    isActive={isCurrentPage}
                    className={
                      isClickable
                        ? "cursor-pointer"
                        : "pointer-events-none opacity-50"
                    }
                    aria-disabled={!isClickable}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {hasNextPage && currentPage < totalPagesKnown - 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={handleNextPage}
                className={
                  !hasNextPage
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
                aria-disabled={!hasNextPage}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      {/* Results Info */}
      <div className="text-center text-sm text-muted-foreground">
        Showing page {currentPage} • {data.count} books on this page
        {!hasNextPage && currentPage === totalPagesKnown && (
          <span> • End of results</span>
        )}
      </div>
    </div>
  );
};
