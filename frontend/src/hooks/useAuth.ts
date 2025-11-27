import { useAppSelector } from "@/hooks/hooks";
import { useGetUserProfileQuery } from "@/api/authApi";

export const useAuth = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const { isLoading, isFetching } = useGetUserProfileQuery(undefined, {
    skip: isAuthenticated, // will only run if not authenticated
  });

  return {
    user,
    isAuthenticated,
    isAdmin: user?.role === "ADMIN",
    isLoading: isLoading || isFetching,
  };
};
