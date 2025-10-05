import { z } from "zod";
import { BookCategory } from "../types/book";

export const updateBookSchema = z
  .object({
    title: z
      .string()
      .min(1, "Title is required")
      .max(200, "Title is too long")
      .optional(),
    category: z.enum(BookCategory).optional(),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .max(2000, "Description is too long")
      .optional(),
    author: z
      .string()
      .min(1, "Author is required")
      .max(100, "Author name is too long")
      .optional(),
    isbn: z
      .string()
      .regex(
        /^(?:ISBN(?:-1[03])?:? )?(?=[0-9X]{10}$|(?=(?:[0-9]+[- ]){3})[- 0-9X]{13}$|97[89][0-9]{10}$|(?=(?:[0-9]+[- ]){4})[- 0-9]{17}$)(?:97[89][- ]?)?[0-9]{1,5}[- ]?[0-9]+[- ]?[0-9]+[- ]?[0-9X]$/,
        "Invalid ISBN format"
      )
      .optional(),
    publisher: z.string().min(1).max(100).optional(),
    publishedYear: z
      .number()
      .int()
      .max(new Date().getFullYear(), "Published year cannot be in the future")
      .optional(),
    language: z.string().min(2).max(10).optional(),
    pageCount: z.number().int().positive().optional(),
    price: z
      .number()
      .positive("Price must be positive")
      .min(0, "Price cannot be negative")
      .optional(),
    stockQuantity: z
      .number()
      .int()
      .min(0, "Stock quantity cannot be negative")
      .optional(),
    coverImageKey: z.string().optional(),
  })
  .strict()
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  }); // To prevent empty updates

export type UpdateBookInput = z.infer<typeof updateBookSchema>;
