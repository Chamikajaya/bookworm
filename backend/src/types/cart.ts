export interface CartItem {
  userId: string;
  bookId: string;
  quantity: number;
  bookTitle: string;
  bookPrice: number;
  bookAuthor: string;
  bookCoverImage?: string;
  addedAt: string;
}

export interface AddToCartInput {
  bookId: string;
  quantity: number;
}

export interface UpdateCartItemInput {
  quantity: number;
}

export interface CartSummary {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}
