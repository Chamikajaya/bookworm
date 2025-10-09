import { APIGatewayProxyEvent } from "aws-lambda";
import { verifyToken } from "../utils/jwt";
import { parseCookies, COOKIE_NAMES } from "../utils/cookie";
import { userService } from "../service/userService";
import { User } from "../types/user";
import { AuthenticationError } from "../utils/errors";

// extending the APIGatewayProxyEvent to include user information - after the authenticate middleware runs, it would add user info to the event
export interface AuthenticatedEvent extends APIGatewayProxyEvent {
  user?: User;
  userId?: string;
}

export const authenticate = async (
  event: APIGatewayProxyEvent
): Promise<User> => {
  const cookies = parseCookies(event.headers.Cookie || event.headers.cookie);
  const accessToken = cookies[COOKIE_NAMES.ACCESS_TOKEN];

  if (!accessToken) {
    throw new AuthenticationError("No access token provided");
  }

  try {
    // verify token and fetch user
    const decoded = await verifyToken(accessToken);
    const user = await userService.getUserById(decoded.sub); // cognito sub is the user id in users dynamoDB table
    return user;
  } catch (error) {
    console.error("Authentication error:", error);
    throw new AuthenticationError("Invalid or expired token");
  }
};
