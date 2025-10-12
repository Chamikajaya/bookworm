import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import type { UserRole } from "@/types/authTypes";

export const useRequireAuth = (requiredRole?: UserRole) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for loading to complete
    if (isLoading) {
      return;
    }

    // Check authentication
    if (!isAuthenticated) {
      navigate("/", { replace: true });
      return;
    }

    // Check role requirement
    if (requiredRole === "ADMIN" && user?.role !== "ADMIN") {
      navigate("/forbidden", { replace: true });
      return;
    }
  }, [isAuthenticated, isLoading, user, requiredRole, navigate]);

  return { user, isLoading };
};
