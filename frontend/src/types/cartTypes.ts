export interface CartItem {
  userId: string;
  bookId: string;
  quantity: number;
  bookTitle: string;
  bookAuthor: string;
  bookPrice: number;
  bookCoverImage?: string;
  addedAt: number;
}

export interface CartSummary {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface AddToCartInput {
  bookId: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}

export interface CartState {
  cart: CartSummary | null;
  isLoading: boolean;
  error: string | null;
}
