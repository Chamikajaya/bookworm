import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Book } from "@/types/bookTypes";
import { useNavigate } from "react-router-dom";

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={() => navigate(`/books/${book.id}`)}
    >
      <CardHeader className="p-0">
        <div className="aspect-[2/3] overflow-hidden rounded-t-lg bg-muted">
          {/* TODO: If there is no cover , need to display a placeholder image */}
          {book.coverImageUrl ? (
            <img
              src={book.coverImageUrl}
              alt={book.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No Cover
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2 mb-1">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
        {book.category && (
          <Badge variant="secondary" className="text-xs">
            {book.category}
          </Badge>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <span className="font-bold text-lg">${book.price.toFixed(2)}</span>
        {book.stockQuantity > 0 ? (
          <span className="text-xs text-green-600">In Stock</span>
        ) : (
          <span className="text-xs text-red-600">Out of Stock</span>
        )}
      </CardFooter>
    </Card>
  );
};
