import { useRef } from "react";
import { useSearchParams } from "react-router-dom";
import type { BookCategory, SortBy, SortOrder } from "@/types/bookTypes";

export const useBookFilters = () => {
  const [searchParams] = useSearchParams();

  const title = searchParams.get("title") || undefined;
  const author = searchParams.get("author") || undefined;
  const category = searchParams.get("category") as BookCategory | undefined;
  const minPrice = searchParams.get("minPrice")
    ? parseFloat(searchParams.get("minPrice")!)
    : undefined;
  const maxPrice = searchParams.get("maxPrice")
    ? parseFloat(searchParams.get("maxPrice")!)
    : undefined;
  const sortBy = (searchParams.get("sortBy") || "updatedAt") as SortBy;
  const sortOrder = (searchParams.get("sortOrder") || "desc") as SortOrder;

  const prevFiltersRef = useRef({
    title,
    author,
    category,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
  });

  const checkFiltersChanged = () => {
    const prev = prevFiltersRef.current;
    return (
      prev.title !== title ||
      prev.author !== author ||
      prev.category !== category ||
      prev.minPrice !== minPrice ||
      prev.maxPrice !== maxPrice ||
      prev.sortBy !== sortBy ||
      prev.sortOrder !== sortOrder
    );
  };

  const updateFiltersRef = () => {
    prevFiltersRef.current = {
      title,
      author,
      category,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
    };
  };

  return {
    filters: {
      title,
      author,
      category,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
    },
    checkFiltersChanged,
    updateFiltersRef,
  };
};
