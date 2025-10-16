import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const EmptyCart = () => {
  const navigate = useNavigate();
  return (
    <Card className="max-w-md mx-auto">
      <CardContent className="flex flex-col items-center py-12">
        <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground text-center mb-6">
          Start adding some books to your cart!
        </p>
        <Button onClick={() => navigate("/")}>Browse Books</Button>
      </CardContent>
    </Card>
  );
};
