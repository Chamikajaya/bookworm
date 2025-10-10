import { useEffect } from "react";
import { useAppSelector } from "@/hooks/hooks";
import { useGetUserProfileQuery } from "@/api/authApi";

export const useAuth = () => {
  const authState = useAppSelector((state) => state.auth); // for reading auth state from the store
  // refetch allows to manually trigger the query  -->
  const { refetch } = useGetUserProfileQuery(undefined, {
    skip: authState.isAuthenticated,
  });

  useEffect(() => {
    if (!authState.isAuthenticated && !authState.isLoading) refetch();
  }, [authState.isAuthenticated, authState.isLoading, refetch]);

  return {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    isAdmin: authState.user?.role === "ADMIN",
    isCustomer: authState.user?.role === "CUSTOMER",
  };
};
