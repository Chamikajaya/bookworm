import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { cognitoService } from "../../service/cognitoService";
import { userService } from "../../service/userService";
import { createCookie, COOKIE_NAMES } from "../../utils/cookie";
import { successResponse } from "../../utils/response";
import { handleError } from "../../utils/handleErrors";
import { logger } from "../../config/logger";
import { ValidationError } from "../../utils/errors";
import { UserRole } from "../../types/user";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    logger.info("OAuth callback received", { body: event.body });

    if (!event.body) {
      throw new ValidationError("Request body is required");
    }

    const { code, redirectUri } = JSON.parse(event.body);

    if (!code || !redirectUri) {
      throw new ValidationError(
        "Authorization code and redirect URI are required"
      );
    }

    // Exchange authorization code for tokens
    const tokens = await cognitoService.exchangeCodeForTokens(
      code,
      redirectUri
    );

    // Extract user info from ID token
    const cognitoUser = cognitoService.extractUserInfo(tokens.idToken);
    if (!cognitoUser) {
      throw new ValidationError(
        "Failed to extract user information from token"
      );
    }

    // Check if user exists, if not create new user
    let user = await userService.getUserByEmail(cognitoUser.email);
    if (!user) {
      user = await userService.createUser(cognitoUser);
      logger.info("New user created", {
        userId: user.userId,
        email: user.email,
        role: user.role,
      });
    } else {
      await userService.updateLastLogin(user.userId);
      logger.info("Existing user logged in", {
        userId: user.userId,
        email: user.email,
      });
    }

    // Set HTTP-only cookies
    const cookies = [
      createCookie(COOKIE_NAMES.ACCESS_TOKEN, tokens.accessToken, {
        maxAge: 60 * 60,
      }), // 1 hour
      createCookie(COOKIE_NAMES.REFRESH_TOKEN, tokens.refreshToken, {
        maxAge: 7 * 24 * 60 * 60,
      }), // 7 days
      createCookie(COOKIE_NAMES.ID_TOKEN, tokens.idToken, { maxAge: 60 * 60 }), // 1 hour
    ];

    return {
      ...successResponse(
        {
          user,
          redirectTo:
            user.role === UserRole.ADMIN ? "/admin/dashboard" : "/dashboard",
        },
        "Authentication successful",
        200
      ),
      multiValueHeaders: {
        "Set-Cookie": cookies,
      },
    };
  } catch (error) {
    return handleError(error, "authCallback");
  }
}
