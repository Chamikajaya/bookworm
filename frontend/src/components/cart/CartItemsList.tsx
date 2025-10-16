import { type CartItem } from "@/types/cartTypes";
import { Button } from "@/components/ui/button";
import { CartItemCard } from "./CartItemCard";

interface CartItemsListProps {
  items: CartItem[];
  onQuantityChange: (bookId: string, newQuantity: number) => void;
  onRemove: (bookId: string) => void;
  onClearCart: () => void;
  isUpdating: boolean;
  isRemoving: boolean;
}

export const CartItemsList = ({
  items,
  onQuantityChange,
  onRemove,
  onClearCart,
  isUpdating,
  isRemoving,
}: CartItemsListProps) => {
  return (
    <div className="lg:col-span-2 space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Items</h2>
        <Button variant="ghost" size="sm" onClick={onClearCart}>
          Clear Cart
        </Button>
      </div>

      {items.map((item) => (
        <CartItemCard
          key={item.bookId}
          item={item}
          onQuantityChange={onQuantityChange}
          onRemove={onRemove}
          isUpdating={isUpdating}
          isRemoving={isRemoving}
        />
      ))}
    </div>
  );
};
