import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Book } from "@/types/bookTypes";
import { useNavigate, useLocation } from "react-router-dom";

interface BookCardProps {
  book: Book;
}

export const BookCard = ({ book }: BookCardProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    // Pass current location (including query params) as state
    navigate(`/books/${book.id}`, {
      state: { from: `${location.pathname}${location.search}` },
    });
  };

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={handleClick}
    >
      <CardHeader className="p-0">
        <div className="aspect-[2/3] overflow-hidden rounded-t-lg bg-muted">
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
      <CardContent className="pt-4">
        <h3 className="font-semibold text-lg line-clamp-2 mb-1">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-1">
          {book.author}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center pt-0">
        <span className="text-xl font-bold">${book.price.toFixed(2)}</span>
        {book.stockQuantity > 0 ? (
          <Badge variant="default" className="bg-green-600">
            In Stock
          </Badge>
        ) : (
          <Badge variant="destructive">Out of Stock</Badge>
        )}
      </CardFooter>
    </Card>
  );
};
