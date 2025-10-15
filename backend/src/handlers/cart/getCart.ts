import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { handleError } from "../../utils/handleErrors";
import { logger } from "../../config/logger";
import { authenticate } from "../../middleware/auth";
import { cartService } from "../../service/cartService";
import { successResponse } from "../../utils/response";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    logger.info("Get  cart request received.");
    const user = await authenticate(event);
    const cart = await cartService.getCart(user.userId);
    return successResponse(cart, "Cart retrieved successfully", 200);
  } catch (error) {
    return handleError(error, "getCart");
  }
}
