import { BookGrid } from "@/components/book/BookGrid";

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Bookworm</h1>
          <p className="text-muted-foreground mt-1">
            Discover your next favorite book
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <BookGrid />
      </main>
    </div>
  );
};
