import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { authenticate } from "../../middleware/auth";
import { orderService } from "../../service/orderService";
import { successResponse } from "../../utils/response";
import { handleError } from "../../utils/handleErrors";
import { logger } from "../../config/logger";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    logger.info("Get orders request received");

    const user = await authenticate(event);
    const orders = await orderService.getOrdersByUser(user.userId);

    return successResponse({ orders }, "Orders retrieved successfully", 200);
  } catch (error) {
    return handleError(error, "getOrders");
  }
}
