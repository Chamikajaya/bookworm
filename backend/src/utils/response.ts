import {
  SuccessResponse,
  ErrorResponse,
  ApiResponse,
} from "../types/apiResponse";

export const createResponse = <T>(
  statusCode: number,
  body: SuccessResponse<T> | ErrorResponse
): ApiResponse => {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": process.env.FRONTEND_URL,
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Headers":
        "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Cookie",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    },
    body: JSON.stringify(body),
  };
};

export const successResponse = <T>(
  data: T,
  message?: string,
  statusCode: number = 200
): ApiResponse => {
  return createResponse(statusCode, { data, message });
};

export const errorResponse = (
  error: string,
  statusCode: number = 500,
  message?: string
): ApiResponse => {
  return createResponse(statusCode, { error, message });
};
