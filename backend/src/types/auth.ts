import { User } from "./user";

export interface CognitoTokens {
  accessToken: string;
  refreshToken: string;
  idToken: string;
  expiresIn: number;
}

export interface CognitoUserInfo {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified?: boolean;
}

export interface AuthenticatedRequest {
  user?: User;
  userId?: string;
}
