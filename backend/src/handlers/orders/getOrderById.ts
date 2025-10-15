import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { authenticate } from "../../middleware/auth";
import { orderService } from "../../service/orderService";
import { successResponse } from "../../utils/response";
import { handleError } from "../../utils/handleErrors";
import { logger } from "../../config/logger";
import { ValidationError } from "../../utils/errors";
import { UserRole } from "../../types/user";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const orderId = event.pathParameters?.orderId;
    logger.info("Get order by ID request received", { orderId });

    if (!orderId) {
      throw new ValidationError("Order ID is required");
    }

    const user = await authenticate(event);

    // Non-admin users can only view their own orders
    const userId = user.role === UserRole.ADMIN ? undefined : user.userId;
    const orderWithItems = await orderService.getOrderById(orderId, userId);

    return successResponse(orderWithItems, "Order retrieved successfully", 200);
  } catch (error) {
    return handleError(error, "getOrderById");
  }
}
