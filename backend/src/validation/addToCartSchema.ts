import { z } from "zod";

export const addToCartSchema = z.object({
  bookId: z.string().min(1, "Book ID is required"),
  quantity: z.number().int().positive("Quantity must be positive"),
});
