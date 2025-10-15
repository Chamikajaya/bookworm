import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { authenticate } from "../../middleware/auth";
import { requireRole } from "../../middleware/rbac";
import { orderService } from "../../service/orderService";
import { successResponse } from "../../utils/response";
import { handleError } from "../../utils/handleErrors";
import { logger } from "../../config/logger";
import { OrderStatus } from "../../types/order";
import { UserRole } from "../../types/user";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    logger.info("Get all orders request received - ADMIN ONLY");

    const user = await authenticate(event);
    requireRole(user, UserRole.ADMIN);

    const status = event.queryStringParameters?.status as
      | OrderStatus
      | undefined;
    const orders = await orderService.getAllOrders(status);

    return successResponse({ orders }, "Orders retrieved successfully", 200);
  } catch (error) {
    return handleError(error, "getAllOrders");
  }
}
