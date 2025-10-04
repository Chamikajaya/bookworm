import { APIGatewayProxyResult } from "aws-lambda";
import { errorResponse } from "./response";
import {
  NotFoundError,
  ValidationError,
  DatabaseError,
  InternalServerError,
} from "./errors";
import { logger } from "../config/logger";

export const handleError = (
  error: unknown,
  context: string
): APIGatewayProxyResult => {
  logger.error(`Error in ${context}:`, error as Error);

  if (error instanceof NotFoundError) {
    return errorResponse("Not Found Error", 404, error.message);
  }

  if (error instanceof ValidationError) {
    return errorResponse("Validation Error", 400, error.message);
  }

  if (error instanceof DatabaseError) {
    return errorResponse("Database Error", 503, error.message);
  }

  if (error instanceof InternalServerError) {
    return errorResponse("Internal Server Error", 500, error.message);
  }

  // Handle unknown errors
  const errorMessage = error instanceof Error ? error.message : String(error);
  return errorResponse("Internal Server Error", 500, errorMessage);
};
