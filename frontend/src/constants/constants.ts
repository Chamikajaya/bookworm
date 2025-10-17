import type { BookCategory } from "@/types/bookTypes";
import type { OrderStatus } from "@/types/orderTypes";

export const ITEMS_PER_PAGE = 10;

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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

export const statusColors: Record<OrderStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PROCESSING: "bg-blue-100 text-blue-800",
  SHIPPED: "bg-purple-100 text-purple-800",
};
