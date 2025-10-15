import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import { handleError } from "../../utils/handleErrors";
import { authenticate } from "../../middleware/auth";
import { ValidationError } from "../../utils/errors";
import { logger } from "../../config/logger";

import { cartService } from "../../service/cartService";
import { successResponse } from "../../utils/response";
import { updateCartSchema } from "../../validation/updateCartSchema";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const bookId = event.pathParameters?.bookId;
    logger.info("Add to cart request received", { bookId, body: event.body });
    if (!bookId) throw new ValidationError("Book Id is required");

    const user = await authenticate(event);

    if (!event.body) {
      throw new ValidationError("Request body is required");
    }

    const parsedBody = JSON.parse(event.body);
    const validationResult = updateCartSchema.safeParse(parsedBody);

    if (!validationResult.success) {
      const tree = z.treeifyError(validationResult.error);
      throw new ValidationError(JSON.stringify(tree));
    }

    const cartItem = await cartService.updateCartItem(
      user.userId,
      bookId,
      validationResult.data
    );
    return successResponse(cartItem, "Cart item updated", 200);
  } catch (error) {
    return handleError(error, "updateCartItem");
  }
}
