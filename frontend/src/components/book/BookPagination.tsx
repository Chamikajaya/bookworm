import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface BookPaginationProps {
  currentPage: number;
  maxKnownPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  onPageChange: (page: number) => void; // when clicked on a specific page number
  onNextPage: () => void; // when clicked on next button
  onPreviousPage: () => void; // when clicked on previous button
}

export const BookPagination = ({
  currentPage,
  maxKnownPage,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
  onNextPage,
  onPreviousPage,
}: BookPaginationProps) => {
  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;

    if (maxKnownPage <= maxVisiblePages) {
      // just show all pages we know about if total pages are 5 or less
      for (let i = 1; i <= maxKnownPage; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4);
        if (maxKnownPage > 4) {
          pages.push(5);
        }
      } else if (currentPage >= maxKnownPage - 2) {
        for (let i = maxKnownPage - 4; i <= maxKnownPage; i++) {
          if (i > 0) pages.push(i);
        }
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  if (maxKnownPage <= 1 && !hasNextPage) {
    return null;
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={onPreviousPage}
            className={
              !hasPreviousPage
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
            aria-disabled={!hasPreviousPage}
          />
        </PaginationItem>

        {currentPage > 3 && maxKnownPage > 5 && (
          <>
            <PaginationItem>
              <PaginationLink
                onClick={() => onPageChange(1)}
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
          const isCurrentPage = currentPage === page;
          const isClickable = page <= maxKnownPage;

          return (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => isClickable && onPageChange(page)}
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

        {hasNextPage && currentPage < maxKnownPage - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}

        <PaginationItem>
          <PaginationNext
            onClick={onNextPage}
            className={
              !hasNextPage ? "pointer-events-none opacity-50" : "cursor-pointer"
            }
            aria-disabled={!hasNextPage}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
