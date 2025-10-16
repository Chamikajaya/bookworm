import { useEffect, useState } from "react";
import { type CartItem } from "@/types/cartTypes";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Minus, Plus, Trash2 } from "lucide-react";
import placeholder from "@/assets/book-placeholder.png";

interface CartItemCardProps {
  item: CartItem;
  onQuantityChange: (bookId: string, newQuantity: number) => void;
  onRemove: (bookId: string) => void;
  isUpdating: boolean;
  isRemoving: boolean;
}

export const CartItemCard = ({
  item,
  onQuantityChange,
  onRemove,
  isUpdating,
  isRemoving,
}: CartItemCardProps) => {
  const [localQty, setLocalQty] = useState(item.quantity);

  useEffect(() => {
    setLocalQty(item.quantity);
  }, [item.quantity]);

  // debounce quantity changes to avoid firing an API call on every click
  useEffect(() => {
    const id = setTimeout(() => {
      if (localQty !== item.quantity) {
        onQuantityChange(item.bookId, localQty);
      }
    }, 500);
    return () => clearTimeout(id);
  }, [localQty, item.bookId, item.quantity, onQuantityChange]);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Book Image */}
          <div className="w-24 h-32 flex-shrink-0 bg-muted rounded overflow-hidden">
            <img
              src={item.bookCoverImage || placeholder}
              alt={item.bookTitle}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Book Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1 truncate">
              {item.bookTitle}
            </h3>
            <p className="text-sm text-muted-foreground mb-2">
              by {item.bookAuthor}
            </p>
            <p className="font-bold text-lg">${item.bookPrice.toFixed(2)}</p>
          </div>

          {/* Quantity Controls & Actions */}
          <div className="flex flex-col items-end justify-between">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(item.bookId)}
              disabled={isRemoving}
            >
              <Trash2 className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setLocalQty((q) => Math.max(1, q - 1))}
                disabled={localQty <= 1 || isUpdating}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-semibold">{localQty}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setLocalQty((q) => q + 1)}
                disabled={isUpdating}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <p className="font-semibold">
              ${(item.bookPrice * localQty).toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
