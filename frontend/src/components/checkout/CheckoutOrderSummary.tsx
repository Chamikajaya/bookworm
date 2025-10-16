import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { type CartSummary } from "@/types/cartTypes";

interface CheckoutOrderSummaryProps {
  cart: CartSummary;
}

export const CheckoutOrderSummary = ({ cart }: CheckoutOrderSummaryProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {cart.items.map((item) => (
            <div key={item.bookId} className="flex justify-between text-sm">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{item.bookTitle}</p>
                <p className="text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium ml-4">
                ${(item.bookPrice * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">${cart.totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium text-green-600">Free</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg">
            <span className="font-semibold">Total</span>
            <span className="font-bold">${cart.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-muted p-4 rounded-lg mt-4">
          <p className="text-sm text-muted-foreground">
            <strong>Note:</strong> This is a demo checkout. No actual payment
            will be processed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
