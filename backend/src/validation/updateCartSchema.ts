import z from "zod";

export const updateCartSchema = z.object({
  quantity: z.number().int().positive("Quantity must be positive"),
});
