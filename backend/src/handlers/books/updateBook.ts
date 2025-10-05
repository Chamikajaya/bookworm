import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { z } from "zod";
import { bookService } from "../../service/bookService";
import { logger } from "../../config/logger";
import { ValidationError } from "../../utils/errors";
import { updateBookSchema } from "../../validation/updateBookSchema";
import { handleError } from "../../utils/handleErrors";
import { successResponse } from "../../utils/response";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const bookId = event.pathParameters?.id;
    logger.info("Update book request received", {
      bookId,
      body: event.body,
    });

    if (!bookId) {
      throw new ValidationError("Book ID is required");
    }

    if (!event.body) {
      throw new ValidationError("Request body is required");
    }

    // Parse JSON body
    let parsedBody;
    try {
      parsedBody = JSON.parse(event.body);
    } catch (error) {
      throw new ValidationError("Invalid JSON in request body");
    }

    // Validate with Zod schema
    const validationResult = updateBookSchema.safeParse(parsedBody);
    if (!validationResult.success) {
      const tree = z.treeifyError(validationResult.error);
      throw new ValidationError(JSON.stringify(tree));
    }

    // Update book
    const updatedBook = await bookService.updateBook(
      bookId,
      validationResult.data
    );

    return successResponse(updatedBook, "Book updated successfully", 200);
  } catch (error) {
    return handleError(error, "updateBook");
  }
}
