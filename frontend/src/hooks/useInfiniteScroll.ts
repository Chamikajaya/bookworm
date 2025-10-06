import { useEffect, useRef, useState } from "react";

interface UseInfiniteScrollProps {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number; // Percentage of scroll (0-1)
}

export const useInfiniteScroll = ({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 0.8,
}: UseInfiniteScrollProps) => {
  const observerTarget = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          setShouldLoad(true);
        }
      },
      { threshold }
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [hasMore, isLoading, threshold]);

  useEffect(() => {
    if (shouldLoad) {
      onLoadMore();
      setShouldLoad(false);
    }
  }, [shouldLoad, onLoadMore]);

  return observerTarget;
};
