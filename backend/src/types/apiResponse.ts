import { int, intersection } from "zod";

export interface ApiResponse {
  statusCode: number;
  body: string;
  headers?: {
    "Content-Type": string;
    "Access-Control-Allow-Origin"?: string;
    "Access-Control-Allow-Credentials"?: string;
    "Access-Control-Allow-Headers"?: string;
    "Access-Control-Allow-Methods"?: string;
  };
}

export interface ErrorResponse {
  error: string;
  message?: string;
  details?: any;
}

export interface SuccessResponse<T = any> {
  message?: string;
  data?: T;
}
