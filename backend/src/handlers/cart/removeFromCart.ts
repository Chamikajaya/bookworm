import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { authenticate } from "../../middleware/auth";
import { cartService } from "../../service/cartService";
import { successResponse } from "../../utils/response";
import { handleError } from "../../utils/handleErrors";
import { logger } from "../../config/logger";
import { ValidationError } from "../../utils/errors";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const bookId = event.pathParameters?.bookId;
    logger.info("Remove from cart request received", { bookId });

    if (!bookId) {
      throw new ValidationError("Book ID is required");
    }

    const user = await authenticate(event);
    await cartService.removeFromCart(user.userId, bookId);

    return successResponse({}, "Item removed from cart", 200);
  } catch (error) {
    return handleError(error, "removeFromCart");
  }
}
