import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import { Header } from "@/components/layout/Header";

export const Forbidden = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto text-center space-y-6">
          <ShieldAlert className="h-24 w-24 text-destructive mx-auto" />
          <h1 className="text-4xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground text-lg">
            You don't have permission to access this page. This area is
            restricted to administrators only.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate(-1)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
            <Button onClick={() => navigate("/")}>Go to Home</Button>
          </div>
        </div>
      </main>
    </div>
  );
};
