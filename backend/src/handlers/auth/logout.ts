import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { clearCookie, COOKIE_NAMES } from "../../utils/cookie";
import { successResponse } from "../../utils/response";
import { handleError } from "../../utils/handleErrors";
import { logger } from "../../config/logger";

export async function handler(
  _event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    logger.info("Logout request received");

    const cookies = [
      clearCookie(COOKIE_NAMES.ACCESS_TOKEN),
      clearCookie(COOKIE_NAMES.REFRESH_TOKEN),
      clearCookie(COOKIE_NAMES.ID_TOKEN),
    ];

    return {
      ...successResponse({}, "Logout successful", 200),
      multiValueHeaders: {
        "Set-Cookie": cookies,
      },
    };
  } catch (error) {
    return handleError(error, "authLogout");
  }
}
