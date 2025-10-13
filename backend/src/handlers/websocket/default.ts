import { APIGatewayProxyResult } from "aws-lambda";
import { WebSocketEvent } from "../../types/chat";
import { logger } from "../../config/logger";
import { handleError } from "../../utils/handleErrors";

export async function handler(
  event: WebSocketEvent
): Promise<APIGatewayProxyResult> {
  logger.warn("Unhandled WebSocket route", {
    routeKey: event.requestContext.routeKey,
    connectionId: event.requestContext.connectionId,
  });

  return handleError(
    new Error("Unhandled WebSocket route"),
    "webSocketDefault"
  );
}
