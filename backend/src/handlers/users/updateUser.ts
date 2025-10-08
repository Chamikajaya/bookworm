import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import { authenticate } from "../../middleware/auth";
import { userService } from "../../service/userService";
import { successResponse } from "../../utils/response";
import { handleError } from "../../utils/handleErrors";
import { logger } from "../../config/logger";
import { ValidationError } from "../../utils/errors";
import { updateProfileSchema } from "../../validation/updateUserSchema";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    logger.info("Update user profile request received", { body: event.body });

    if (!event.body) {
      throw new ValidationError("Request body is required");
    }

    const user = await authenticate(event);

    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch {
      throw new ValidationError("Invalid JSON");
    }

    const validationResult = updateProfileSchema.safeParse(parsedBody);
    if (!validationResult.success) {
      const tree = z.treeifyError(validationResult.error);
      throw new ValidationError(JSON.stringify(tree));
    }

    const updatedUser = await userService.updateUser(
      user.userId,
      validationResult.data
    );

    return successResponse(
      { user: updatedUser },
      "Profile updated successfully",
      200
    );
  } catch (error) {
    return handleError(error, "updateUserProfile");
  }
}
