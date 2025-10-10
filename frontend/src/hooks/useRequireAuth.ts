import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import type { UserRole } from "@/types/authTypes";

export const useRequireAuth = (requiredRole?: UserRole) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate("/", { replace: true });
      } else if (requiredRole === "ADMIN" && user?.role !== "ADMIN") {
        navigate("/forbidden", { replace: true });
      }
    }
  }, [isAuthenticated, isLoading, user, requiredRole, navigate]);

  return { user, isLoading };
};
