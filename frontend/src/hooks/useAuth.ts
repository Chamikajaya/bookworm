import { useAppSelector } from "@/hooks/hooks";
import { useGetUserProfileQuery } from "@/api/authApi";
import { useEffect } from "react";

export const useAuth = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { isLoading, isFetching } = useGetUserProfileQuery(undefined, {
    skip: isAuthenticated, // will only run if not authenticated
  });

  useEffect(() => {
    console.log("🔵 useAuth state:", {
      user,
      isAuthenticated,
      isLoading,
      isFetching,
    });
  }, [user, isAuthenticated, isLoading, isFetching]);

  return {
    user,
    isAuthenticated,
    isAdmin: user?.role === "ADMIN",
    isLoading: isLoading || isFetching,
  };
};
