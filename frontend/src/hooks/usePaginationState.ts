import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const usePaginationState = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const pageFromUrl = parseInt(searchParams.get("page") || "1", 10); // runs on every render

  const [currentPage, setCurrentPage] = useState(pageFromUrl); // only runs on initial render, and will be ignored on subsequent renders
  const [pageKeys, setPageKeys] = useState<Record<number, string | undefined>>({
    1: undefined,
  });
  const [maxKnownPage, setMaxKnownPage] = useState(1);

  // Sync currentPage with URL which is an external source of truth
  useEffect(() => {
    const urlPage = parseInt(searchParams.get("page") || "1", 10);

    // if internal state (currentPage) is different from the URL page, update the internal state
    if (urlPage !== currentPage) {
      setCurrentPage(urlPage);
    }
  }, [searchParams, currentPage]);

  const resetPagination = () => {
    setCurrentPage(1);
    setPageKeys({ 1: undefined });
    setMaxKnownPage(1);
  };

  const updatePageKeys = (hasMore: boolean, lastEvaluatedKey?: string) => {
    if (hasMore && lastEvaluatedKey) {
      setPageKeys((prev) => ({
        ...prev,
        [currentPage + 1]: lastEvaluatedKey,
      }));
      setMaxKnownPage(currentPage + 1);
    } else {
      setMaxKnownPage(currentPage);
    }
  };

  // function to call when the user clicks on a pagination button
  const updateUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    currentPage,
    setCurrentPage,
    pageKeys,
    maxKnownPage,
    resetPagination,
    updatePageKeys,
    updateUrl,
  };
};
