import { useNavigate } from "react-router-dom";
import { Plus, BookOpen, Package } from "lucide-react";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useRequireAuth("ADMIN");

  if (authLoading) {
    return null;
  }

  const quickActions = [
    {
      title: "Add New Book",
      description: "Create a new book listing",
      icon: Plus,
      action: () => navigate("/admin/add-book"),
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Manage Orders",
      description: "View and update order status",
      icon: Package,
      action: () => navigate("/admin/orders"),
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
    },
    {
      title: "Browse Books",
      description: "View all books in catalog",
      icon: BookOpen,
      action: () => navigate("/"),
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name?.split(" ")[0]}! Here's your store
            overview.
          </p>
        </div>

        <>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {quickActions.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.title}
                      variant="outline"
                      className="w-full justify-start h-auto p-4"
                      onClick={action.action}
                    >
                      <div className="flex items-center gap-4 w-full">
                        <div className={`p-2 rounded-lg ${action.bgColor}`}>
                          <Icon className={`h-5 w-5 ${action.color}`} />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-semibold">{action.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {action.description}
                          </p>
                        </div>
                      </div>
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        </>
      </main>
    </div>
  );
};
