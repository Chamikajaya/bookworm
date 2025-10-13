import { APIGatewayProxyResult } from "aws-lambda";
import { WebSocketEvent } from "../../types/chat";
import { websocketService } from "../../service/websocketService";
import { logger } from "../../config/logger";
import { handleError } from "../../utils/handleErrors";
import { successResponse } from "../../utils/response";
import { authenticate } from "../../middleware/auth";

export async function handler(
  event: WebSocketEvent
): Promise<APIGatewayProxyResult> {
  try {
    const connectionId = event.requestContext.connectionId;
    const user = await authenticate(event);

    logger.info("WebSocket connect request received", { connectionId });

    await websocketService.saveConnection({
      connectionId,
      userId: user.userId,
      role: user.role,
      email: user.email,
      name: user.name,
      connectedAt: String(Date.now()),
      lastActiveAt: String(Date.now()),
    });

    return successResponse({}, "Connected to WebSocket", 200);
  } catch (error) {
    return handleError(error, "websocketConnect");
  }
}
