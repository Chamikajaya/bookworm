import { APIGatewayProxyResult } from "aws-lambda";
import { SendMessagePayload, WebSocketEvent } from "../../types/chat";
import { websocketService } from "../../service/websocketService";
import { logger } from "../../config/logger";
import { handleError } from "../../utils/handleErrors";
import { successResponse } from "../../utils/response";
import { ValidationError } from "../../utils/errors";

export async function handler(
  event: WebSocketEvent
): Promise<APIGatewayProxyResult> {
  try {
    logger.info("WebSocket sendMessage request received", { body: event.body });
    const connectionId = event.requestContext.connectionId;
    if (!event.body) {
      throw new ValidationError("Message body is required");
    }
    let parsedBody: SendMessagePayload;
    try {
      parsedBody = JSON.parse(event.body);
    } catch (error) {
      throw new ValidationError("Invalid JSON in message body");
    }

    // ! get sender's connection info ? sender's or recipient's connection info ???
    const senderConnections = await websocketService.getConnectionsByUserId(
      parsedBody.recipientId
    );

    if (senderConnections.length === 0) {
      throw new ValidationError("Sender connection not found");
    }

    const senderConnection = senderConnections.find(
      (conn) => conn.connectionId === connectionId
    );
    if (!senderConnection) {
      throw new ValidationError("Invalid sender connection");
    }
  } catch (error) {
    return handleError(error, "webSocketSendMessage");
  }
}
