import { useState, useCallback, useEffect } from "react";
import { useGetBooksQuery } from "@/api/booksApi";
import { BookCard } from "./BookCard";
import { BookSkeleton } from "./BookSkeleton";
import { EmptyState } from "./EmptyState";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import type { Book } from "@/types/bookTypes";

export const BookGrid = () => {
  const [allBooks, setAllBooks] = useState<Book[]>([]);
  const [lastKey, setLastKey] = useState<string | undefined>();

  const { data, isLoading, isFetching, error } = useGetBooksQuery({
    limit: 6,
    lastKey,
  });

  // Accumulate books as we paginate
  useEffect(() => {
    if (data?.items) {
      setAllBooks((prev) => {
        const newBooks = data.items.filter(
          (book) => !prev.some((b) => b.id === book.id)
        );
        return [...prev, ...newBooks];
      });
    }
  }, [data]);

  const loadMore = useCallback(() => {
    if (data?.hasMore && data?.lastEvaluatedKey) {
      setLastKey(data.lastEvaluatedKey);
    }
  }, [data]);

  const observerTarget = useInfiniteScroll({
    hasMore: data?.hasMore ?? false,
    isLoading: isFetching,
    onLoadMore: loadMore,
    threshold: 0.8,
  });

  // Initial loading state
  if (isLoading && allBooks.length === 0) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <BookSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Failed to load books. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  // Empty state
  if (allBooks.length === 0) {
    return <EmptyState />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {allBooks.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>

      {/* Loading more indicator */}
      {isFetching && allBooks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <BookSkeleton key={`loading-${i}`} />
          ))}
        </div>
      )}

      {/* Intersection observer target */}
      <div ref={observerTarget} className="h-4" />

      {/* End of list message */}
      {!data?.hasMore && allBooks.length > 0 && (
        <p className="text-center text-muted-foreground mt-8">
          You've reached the end of the list
        </p>
      )}
    </div>
  );
};
