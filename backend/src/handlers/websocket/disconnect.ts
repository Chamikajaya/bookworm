import { APIGatewayProxyResult } from "aws-lambda";
import { WebSocketEvent } from "../../types/chat";
import { websocketService } from "../../service/websocketService";
import { logger } from "../../config/logger";
import { handleError } from "../../utils/handleErrors";
import { successResponse } from "../../utils/response";

export async function handler(
  event: WebSocketEvent
): Promise<APIGatewayProxyResult> {
  try {
    const connectionId = event.requestContext.connectionId;
    logger.info("WebSocket disconnect request received", { connectionId });
    await websocketService.deleteConnection(connectionId);
    return successResponse({}, "Disconnected from WebSocket", 200);
  } catch (error) {
    return handleError(error, "websocketDisconnect");
  }
}
