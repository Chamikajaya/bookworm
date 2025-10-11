import { useNavigate } from "react-router-dom";
import { Plus, BookOpen } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Header } from "@/components/layout/Header";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useRequireAuth("ADMIN");

  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}! Manage your bookstore.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/admin/add-book")}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Add New Book</h3>
                <p className="text-sm text-muted-foreground">
                  Create a new book listing
                </p>
              </div>
            </div>
          </div>

          <div
            className="border rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Browse Books</h3>
                <p className="text-sm text-muted-foreground">
                  View all books in store
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
