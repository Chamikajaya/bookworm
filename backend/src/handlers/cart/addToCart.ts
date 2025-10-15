import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import { handleError } from "../../utils/handleErrors";
import { authenticate } from "../../middleware/auth";
import { ValidationError } from "../../utils/errors";
import { logger } from "../../config/logger";
import { addToCartSchema } from "../../validation/addToCartSchema";
import { cartService } from "../../service/cartService";
import { successResponse } from "../../utils/response";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    logger.info("Add to cart request received", { body: event.body });

    const user = await authenticate(event);

    if (!event.body) {
      throw new ValidationError("Request body is required");
    }

    const parsedBody = JSON.parse(event.body);
    const validationResult = addToCartSchema.safeParse(parsedBody);

    if (!validationResult.success) {
      const tree = z.treeifyError(validationResult.error);
      throw new ValidationError(JSON.stringify(tree));
    }

    const cartItem = await cartService.addToCart(
      user.userId,
      validationResult.data
    );

    return successResponse(cartItem, "Item added to cart", 201);
  } catch (error) {
    return handleError(error, "addToCart");
  }
}
