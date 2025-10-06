import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  category: z.enum([
    "Fiction",
    "Non-Fiction",
    "Science",
    "History",
    "Biography",
    "Children",
    "Fantasy",
    "Mystery",
    "Romance",
    "Self-Help",
    "Health",
  ]),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description is too long"),
  author: z
    .string()
    .min(1, "Author is required")
    .max(100, "Author name is too long"),
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
    .max(new Date().getFullYear(), "Published year cannot be in the future"),
  language: z.string().min(2).max(10).default("English"),
  pageCount: z.number().int().positive().optional(),
  price: z
    .number()
    .positive("Price must be positive")
    .min(0, "Price cannot be negative"),

  stockQuantity: z
    .number()
    .int()
    .min(0, "Stock quantity cannot be negative")
    .default(0),
  coverImageKey: z.string().optional(),
});

export const imageUploadSchema = z.object({
  imageFile: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 5 * 1024 * 1024,
      "File size must be less than 5MB"
    )
    .refine(
      (file) =>
        ["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
          file.type
        ),
      "Only .jpg, .jpeg, .png and .webp formats are supported"
    )
    .optional(),
});

export type BookMetadataInput = z.infer<typeof bookSchema>;
export type ImageUploadInput = z.infer<typeof imageUploadSchema>;
