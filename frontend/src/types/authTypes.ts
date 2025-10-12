export type UserRole = "ADMIN" | "CUSTOMER";

export interface User {
  userId: string;
  email: string;
  name: string;
  profileImage?: string;
  role: UserRole;
  phoneNumber?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface UpdateProfileInput {
  phoneNumber?: string;
  address?: string;
}
