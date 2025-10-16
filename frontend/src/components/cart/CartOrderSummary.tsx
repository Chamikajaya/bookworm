import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface OrderSummaryProps {
  totalPrice: number;
}

export const CartOrderSummary = ({ totalPrice }: OrderSummaryProps) => {
  const navigate = useNavigate();

  return (
    <div className="lg:col-span-1">
      <Card className="sticky top-24">
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="font-medium">${totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span className="font-medium">Free</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg">
              <span className="font-semibold">Total</span>
              <span className="font-bold">${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <Button
            className="w-full mt-6"
            size="lg"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            className="w-full mt-3"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
