import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useGetBookByIdQuery } from "@/api/booksApi";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, AlertCircle } from "lucide-react";
import placeholder from "@/assets/book-placeholder.png";

export const BookDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: book, isLoading, error } = useGetBookByIdQuery(id!);

  // Get the previous path from location state, or default to root
  const previousPath = (location.state as { from?: string })?.from || "/";

  const handleBackClick = () => {
    // Use navigate with -1 to go back in history if user came from within the app
    // Otherwise, navigate to the stored previous path
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(previousPath);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <Skeleton className="h-10 w-32" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="grid md:grid-cols-2 gap-8">
            <Skeleton className="aspect-[2/3] w-full max-w-md" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-4">
            <Button variant="ghost" onClick={handleBackClick}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load book details. Please try again later.
            </AlertDescription>
          </Alert>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" onClick={handleBackClick}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Books
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={book.coverImageUrl || placeholder}
              alt={book.title}
              className="w-full max-w-md mx-auto rounded-lg shadow-lg"
            />
          </div>

          {/* Book Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{book.title}</h1>
              <p className="text-xl text-muted-foreground">{book.author}</p>
            </div>

            {book.category && (
              <Badge variant="secondary" className="text-sm">
                {book.category}
              </Badge>
            )}

            {book.description && (
              <Card>
                <CardContent className="pt-6">
                  <h2 className="font-semibold mb-2">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {book.description}
                  </p>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardContent className="pt-6 space-y-3">
                <h2 className="font-semibold mb-3">Details</h2>
                {book.isbn && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ISBN:</span>
                    <span className="font-medium">{book.isbn}</span>
                  </div>
                )}
                {book.publisher && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Publisher:</span>
                    <span className="font-medium">{book.publisher}</span>
                  </div>
                )}
                {book.publishedYear && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Published:</span>
                    <span className="font-medium">{book.publishedYear}</span>
                  </div>
                )}
                {book.language && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Language:</span>
                    <span className="font-medium">{book.language}</span>
                  </div>
                )}
                {book.pageCount && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pages:</span>
                    <span className="font-medium">{book.pageCount}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-3xl font-bold">
                    ${book.price.toFixed(2)}
                  </span>
                  {book.stockQuantity > 0 ? (
                    <Badge variant="default" className="bg-green-600">
                      In Stock ({book.stockQuantity})
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  disabled={book.stockQuantity === 0}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};
