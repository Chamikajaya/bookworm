import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import { authenticate } from "../../middleware/auth";
import { orderService } from "../../service/orderService";
import { successResponse } from "../../utils/response";
import { handleError } from "../../utils/handleErrors";
import { logger } from "../../config/logger";
import { ValidationError } from "../../utils/errors";
import { createOrderSchema } from "../../validation/createOrderSchema";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    logger.info("Create order request received", { body: event.body });

    const user = await authenticate(event);

    if (!event.body) {
      throw new ValidationError("Request body is required");
    }

    const parsedBody = JSON.parse(event.body);
    const validationResult = createOrderSchema.safeParse(parsedBody);

    if (!validationResult.success) {
      const tree = z.treeifyError(validationResult.error);
      throw new ValidationError(JSON.stringify(tree));
    }

    const orderWithItems = await orderService.createOrder(
      user.userId,
      user.email,
      user.name,
      validationResult.data
    );

    return successResponse(orderWithItems, "Order created successfully", 201);
  } catch (error) {
    return handleError(error, "createOrder");
  }
}
