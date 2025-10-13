import { APIGatewayProxyResult } from "aws-lambda";
import { WebSocketEvent } from "../../types/chat";
import { websocketService } from "../../service/websocketService";
import { verifyToken } from "../../utils/jwt";
import { logger } from "../../config/logger";
import { handleError } from "../../utils/handleErrors";
import { AuthorizationError } from "../../utils/errors";
import { UserRole } from "../../types/user";
import { successResponse } from "../../utils/response";

export async function connectHandler(
  event: WebSocketEvent
): Promise<APIGatewayProxyResult> {
  try {
    const connectionId = event.requestContext.connectionId;
    const token = event.queryStringParameters?.token;

    logger.info("WebSocket connect request received", { connectionId });

    if (!token) {
      throw new AuthorizationError("Missing auth token when connecting to WS");
    }

    const decoded = await verifyToken(token);
    const userId = decoded.sub;
    const email = decoded.email;
    const name = decoded.name;

    const role =
      email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase()
        ? UserRole.ADMIN
        : UserRole.CUSTOMER;

    await websocketService.saveConnection({
      connectionId,
      userId,
      role,
      email,
      name,
      connectedAt: String(Date.now()),
      lastActiveAt: String(Date.now()),
    });

    return successResponse({}, "Connected to WebSocket", 200);
  } catch (error) {
    return handleError(error, "websocketConnect");
  }
}
