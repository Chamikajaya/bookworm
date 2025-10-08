export enum UserRole {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
}

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

export interface UpdateUserInput {
  phoneNumber?: string;
  address?: string;
}
