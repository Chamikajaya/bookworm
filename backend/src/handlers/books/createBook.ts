import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import { bookService } from "../../service/bookService";
import { logger } from "../../config/logger";
import { ValidationError } from "../../utils/errors";
import { bookSchema } from "../../validation/bookSchema";
import { handleError } from "../../utils/handleErrors";
import { successResponse } from "../../utils/response";
import { authenticate } from "../../middleware/auth";
import { requireRole } from "../../middleware/rbac";
import { UserRole } from "../../types/user";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    logger.info("Create book request received.", { body: event.body });

    // authentication & rbac
    const user = await authenticate(event);
    requireRole(user, UserRole.ADMIN);

    if (!event.body) {
      throw new ValidationError("Request body is required");
    }
    // Parse and validate input
    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch (error) {
      throw new ValidationError("Invalid JSON");
    }

    const validationResult = bookSchema.safeParse(parsedBody);
    if (!validationResult.success) {
      const tree = z.treeifyError(validationResult.error);
      throw new ValidationError(JSON.stringify(tree));
    }
    const bookResponse = await bookService.createBook(validationResult.data);
    return successResponse(
      { id: bookResponse.id },
      "Book created successfully",
      201
    );
  } catch (error) {
    return handleError(error, "createBook");
  }
}
