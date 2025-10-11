import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Header } from "@/components/layout/Header";

export const CustomerDashboard = () => {
  const { user, isLoading } = useRequireAuth();

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Customer Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
      </main>
    </div>
  );
};
