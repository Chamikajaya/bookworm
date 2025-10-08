import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import { bookService } from "../../service/bookService";
import { logger } from "../../config/logger";
import { successResponse } from "../../utils/response";
import { ValidationError } from "../../utils/errors";
import { handleError } from "../../utils/handleErrors";
import {
  UploadUrlRequest,
  uploadUrlRequestSchema,
} from "../../validation/uploadUrlRequestSchema";
import { UserRole } from "../../types/user";
import { requireRole } from "../../middleware/rbac";
import { authenticate } from "../../middleware/auth";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const bookId = event.pathParameters?.id;
    logger.info("Generate upload URL request received", {
      bookId,
    });

    // authentication & rbac
    const user = await authenticate(event);
    requireRole(user, UserRole.ADMIN);

    if (!bookId) {
      throw new ValidationError("Book ID is required");
    }
    if (!event.body) {
      throw new ValidationError("Request body is required");
    }
    let parsedBody: UploadUrlRequest;
    try {
      parsedBody = JSON.parse(event.body);
    } catch (error) {
      throw new ValidationError("Invalid JSON");
    }

    const validationResult = uploadUrlRequestSchema.safeParse(parsedBody);
    if (!validationResult.success) {
      const tree = z.treeifyError(validationResult.error);
      throw new ValidationError(JSON.stringify(tree));
    }

    const { uploadUrl, key } = await bookService.generateCoverImageUploadUrl(
      bookId,
      parsedBody.fileExtension,
      parsedBody.contentType
    );
    return successResponse(
      { uploadUrl, key },
      "Upload URL generated successfully",
      200
    );
  } catch (error) {
    return handleError(error, "generateUploadUrl");
  }
}
