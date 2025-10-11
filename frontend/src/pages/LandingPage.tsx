import { BookGrid } from "@/components/book/BookGrid";
import { Header } from "@/components/layout/Header";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Discover Your Next Favorite Book
          </h1>
          <p className="text-muted-foreground">
            Browse our collection of amazing books
          </p>
        </div>
        <BookGrid />
      </main>
    </div>
  );
};
