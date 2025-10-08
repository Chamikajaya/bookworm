import { User, UserRole } from "../types/user";
import { AuthorizationError } from "../utils/errors";

export const requireRole = (user: User, requiredRole: UserRole): void => {
  if (requiredRole === UserRole.ADMIN && user.role !== UserRole.ADMIN) {
    throw new AuthorizationError("Access denied: Admin role required");
  }
};

export const isAdmin = (user: User): boolean => {
  return user.role === UserRole.ADMIN;
};
