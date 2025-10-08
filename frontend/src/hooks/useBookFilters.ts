import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import type { BookCategory, SortBy, SortOrder } from "@/types/bookTypes";

type FilterKey = "title" | "author" | "category" | "minPrice" | "maxPrice";

export const useBookFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read from URL
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

  // Local state for form inputs
  const [searchQuery, setSearchQuery] = useState(title || "");
  const [authorInput, setAuthorInput] = useState(author || "");
  const [categoryInput, setCategoryInput] = useState<BookCategory | "all">(
    category || "all"
  );
  const [minPriceInput, setMinPriceInput] = useState(
    minPrice?.toString() || ""
  );
  const [maxPriceInput, setMaxPriceInput] = useState(
    maxPrice?.toString() || ""
  );
  const [sortByInput, setSortByInput] = useState<`${SortBy}-${SortOrder}`>(
    `${sortBy}-${sortOrder}` as `${SortBy}-${SortOrder}`
  );

  const prevFiltersRef = useRef({
    title,
    author,
    category,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
  });

  // Sync local state with URL changes
  useEffect(() => {
    setSearchQuery(title || "");
    setAuthorInput(author || "");
    setCategoryInput(category || "all");
    setMinPriceInput(minPrice?.toString() || "");
    setMaxPriceInput(maxPrice?.toString() || "");
    setSortByInput(`${sortBy}-${sortOrder}` as `${SortBy}-${SortOrder}`);
  }, [title, author, category, minPrice, maxPrice, sortBy, sortOrder]);

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

  const applyFilters = () => {
    const params: Record<string, string> = { page: "1" };

    if (searchQuery.trim()) params.title = searchQuery.trim();
    if (authorInput.trim()) params.author = authorInput.trim();
    if (categoryInput !== "all") params.category = categoryInput;
    if (minPriceInput) params.minPrice = minPriceInput;
    if (maxPriceInput) params.maxPrice = maxPriceInput;

    const [sortByValue, sortOrderValue] = sortByInput.split("-") as [
      SortBy,
      SortOrder
    ];
    params.sortBy = sortByValue;
    params.sortOrder = sortOrderValue;

    setSearchParams(params);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setAuthorInput("");
    setCategoryInput("all");
    setMinPriceInput("");
    setMaxPriceInput("");
    setSortByInput("updatedAt-desc");
    setSearchParams({ page: "1", sortBy: "updatedAt", sortOrder: "desc" });
  };

  // when clicked on active filter badges
  const removeFilter = (filterKey: FilterKey) => {
    // Clear the specific filter from local state
    switch (filterKey) {
      case "title":
        setSearchQuery("");
        break;
      case "author":
        setAuthorInput("");
        break;
      case "category":
        setCategoryInput("all");
        break;
      case "minPrice":
        setMinPriceInput("");
        break;
      case "maxPrice":
        setMaxPriceInput("");
        break;
    }

    // Update URL params
    const params: Record<string, string> = { page: "1" }; // reset to first page
    // Only include filters that are not being removed
    if (filterKey !== "title" && searchQuery.trim()) {
      params.title = searchQuery.trim();
    }
    if (filterKey !== "author" && authorInput.trim()) {
      params.author = authorInput.trim();
    }
    if (filterKey !== "category" && categoryInput !== "all") {
      params.category = categoryInput;
    }
    if (filterKey !== "minPrice" && minPriceInput) {
      params.minPrice = minPriceInput;
    }
    if (filterKey !== "maxPrice" && maxPriceInput) {
      params.maxPrice = maxPriceInput;
    }

    const [sortByValue, sortOrderValue] = sortByInput.split("-") as [
      SortBy,
      SortOrder
    ];
    params.sortBy = sortByValue;
    params.sortOrder = sortOrderValue;

    setSearchParams(params);
  };

  const hasActiveFilters = Boolean(
    searchQuery ||
      authorInput ||
      categoryInput !== "all" ||
      minPriceInput ||
      maxPriceInput ||
      sortByInput !== "updatedAt-desc"
  );

  const activeFilterCount = [
    Boolean(searchQuery),
    Boolean(authorInput),
    categoryInput !== "all",
    Boolean(minPriceInput),
    Boolean(maxPriceInput),
    sortByInput !== "updatedAt-desc",
  ].filter(Boolean).length;

  return {
    // URL-synced filters (for API queries)
    filters: {
      title,
      author,
      category,
      minPrice,
      maxPrice,
      sortBy,
      sortOrder,
    },
    // Local form state
    searchQuery,
    setSearchQuery,
    author: authorInput,
    setAuthor: setAuthorInput,
    category: categoryInput,
    setCategory: setCategoryInput,
    minPrice: minPriceInput,
    setMinPrice: setMinPriceInput,
    maxPrice: maxPriceInput,
    setMaxPrice: setMaxPriceInput,
    sortBy: sortByInput,
    setSortBy: setSortByInput,
    // Actions
    applyFilters,
    clearFilters,
    removeFilter,
    // Status
    hasActiveFilters,
    activeFilterCount,
    checkFiltersChanged,
    updateFiltersRef,
  };
};
