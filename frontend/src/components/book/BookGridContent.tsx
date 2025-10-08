import { BookCard } from "./BookCard";
import { BookSkeleton } from "./BookSkeleton";
import type { Book } from "@/types/bookTypes";

interface BookGridContentProps {
  books: Book[];
  isFetching: boolean;
  itemsPerPage: number;
}

export const BookGridContent = ({
  books,
  isFetching,
  itemsPerPage,
}: BookGridContentProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {isFetching
        ? Array.from({ length: itemsPerPage }).map((_, i) => (
            <BookSkeleton key={`loading-${i}`} />
          ))
        : books.map((book) => <BookCard key={book.id} book={book} />)}
    </div>
  );
};
