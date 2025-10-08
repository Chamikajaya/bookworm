import type { BookCategory } from "@/types/bookTypes";

export const ITEMS_PER_PAGE = 10;

export const BOOK_CATEGORIES: BookCategory[] = [
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
];

export const SORT_OPTIONS = [
  { value: "updatedAt-desc", label: "Newest First" },
  { value: "updatedAt-asc", label: "Oldest First" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
] as const;
