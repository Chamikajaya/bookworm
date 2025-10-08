import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { authenticate } from "../../middleware/auth";
import { successResponse } from "../../utils/response";
import { handleError } from "../../utils/handleErrors";
import { logger } from "../../config/logger";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    logger.info("Get current user request received");

    const user = await authenticate(event);

    return successResponse({ user }, "User retrieved successfully", 200);
  } catch (error) {
    return handleError(error, "getUserProfile");
  }
}
