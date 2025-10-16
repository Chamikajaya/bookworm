import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { useGetCartQuery } from "@/api/cartApi";
import { useAuth } from "@/hooks/useAuth";

export const CartIcon = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: cart } = useGetCartQuery(undefined, {
    skip: !isAuthenticated, // Skip the query if the user is not authenticated
  });

  if (!isAuthenticated) return null;

  const itemCount = cart?.totalItems || 0;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      onClick={() => navigate("/cart")}
    >
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <Badge
          variant="destructive"
          className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {itemCount > 9 ? "9+" : itemCount}
        </Badge>
      )}
    </Button>
  );
};
