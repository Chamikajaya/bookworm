import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { authenticate } from "../../middleware/auth";
import { cartService } from "../../service/cartService";
import { successResponse } from "../../utils/response";
import { handleError } from "../../utils/handleErrors";
import { logger } from "../../config/logger";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    logger.info("Clear cart request received");

    const user = await authenticate(event);
    await cartService.clearCart(user.userId);

    return successResponse({}, "Cart cleared", 200);
  } catch (error) {
    return handleError(error, "clearCart");
  }
}
