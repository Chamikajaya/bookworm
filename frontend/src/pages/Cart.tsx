import {
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useGetCartQuery,
} from "@/api/cartApi";
import { Header } from "@/components/layout/Header";
import { Spinner } from "@/components/ui/spinner";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { toast } from "sonner";
import { CartItemsList } from "@/components/cart/CartItemsList";
import { CartOrderSummary } from "@/components/cart/CartOrderSummary";
import { EmptyCart } from "@/components/cart/EmptyCart";

export const CartPage = () => {
  const { isLoading: authLoading } = useRequireAuth();
  const { data: cart, isLoading: cartLoading } = useGetCartQuery();

  const [updateCartItem, { isLoading: isUpdating }] =
    useUpdateCartItemMutation();
  const [removeFromCart, { isLoading: isRemoving }] =
    useRemoveFromCartMutation();
  const [clearCart] = useClearCartMutation();

  const handleQuantityChange = async (bookId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem({ bookId, quantity: newQuantity }).unwrap();
      toast.success("Cart updated successfully");
    } catch (error) {
      toast.error("Failed to update cart");
    }
  };

  const handleRemove = async (bookId: string) => {
    try {
      await removeFromCart(bookId).unwrap();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item from cart");
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart().unwrap();
      toast.success("Cart cleared successfully");
    } catch (error) {
      toast.error("Failed to clear cart");
    }
  };

  if (authLoading) return null;

  if (cartLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <Spinner className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  const isCartEmpty = !cart || cart.items.length === 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">
            {isCartEmpty
              ? "Your cart is empty"
              : `${cart.totalItems} item(s) in your cart`}
          </p>
        </div>

        {isCartEmpty ? (
          <EmptyCart />
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <CartItemsList
              items={cart.items}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove}
              onClearCart={handleClearCart}
              isUpdating={isUpdating}
              isRemoving={isRemoving}
            />
            <CartOrderSummary totalPrice={cart.totalPrice} />
          </div>
        )}
      </main>
    </div>
  );
};
