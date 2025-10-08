import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { cognitoService } from "../../service/cognitoService";
import { parseCookies, createCookie, COOKIE_NAMES } from "../../utils/cookie";
import { successResponse } from "../../utils/response";
import { handleError } from "../../utils/handleErrors";
import { logger } from "../../config/logger";
import { ValidationError } from "../../utils/errors";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    logger.info("Token refresh request received");

    const cookies = parseCookies(event.headers.Cookie || event.headers.cookie);
    const refreshToken = cookies[COOKIE_NAMES.REFRESH_TOKEN];

    if (!refreshToken) {
      throw new ValidationError("No refresh token provided");
    }

    const tokens = await cognitoService.refreshAccessToken(refreshToken);

    const newCookies = [
      createCookie(COOKIE_NAMES.ACCESS_TOKEN, tokens.accessToken, {
        maxAge: 60 * 60,
      }),
      createCookie(COOKIE_NAMES.ID_TOKEN, tokens.idToken, { maxAge: 60 * 60 }),
    ];

    return {
      ...successResponse({}, "Token refreshed successfully", 200),
      multiValueHeaders: {
        "Set-Cookie": newCookies,
      },
    };
  } catch (error) {
    return handleError(error, "authRefresh");
  }
}
