import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import { authenticate } from "../../middleware/auth";
import { requireRole } from "../../middleware/rbac";
import { orderService } from "../../service/orderService";
import { successResponse } from "../../utils/response";
import { handleError } from "../../utils/handleErrors";
import { logger } from "../../config/logger";
import { ValidationError } from "../../utils/errors";
import { updateOrderStatusSchema } from "../../validation/updateOrderStatusSchema";
import { UserRole } from "../../types/user";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const orderId = event.pathParameters?.orderId;
    logger.info("Update order status request received", {
      orderId,
      body: event.body,
    });

    if (!orderId) {
      throw new ValidationError("Order ID is required");
    }

    const user = await authenticate(event);
    requireRole(user, UserRole.ADMIN);

    if (!event.body) {
      throw new ValidationError("Request body is required");
    }

    const parsedBody = JSON.parse(event.body);
    const validationResult = updateOrderStatusSchema.safeParse(parsedBody);

    if (!validationResult.success) {
      const tree = z.treeifyError(validationResult.error);
      throw new ValidationError(JSON.stringify(tree));
    }

    const order = await orderService.updateOrderStatus(
      orderId,
      validationResult.data
    );

    return successResponse({ order }, "Order status updated successfully", 200);
  } catch (error) {
    return handleError(error, "updateOrderStatus");
  }
}
