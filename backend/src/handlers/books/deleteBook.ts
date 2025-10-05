import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { bookService } from "../../service/bookService";
import { logger } from "../../config/logger";
import { handleError } from "../../utils/handleErrors";
import { ValidationError } from "../../utils/errors";
import { successResponse } from "../../utils/response";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const bookId = event.pathParameters?.id;
    logger.info("Delete book by id request received for id " + bookId);

    if (!bookId) {
      throw new ValidationError("Book ID is required");
    }

    await bookService.deleteBook(bookId);
    return successResponse({}, "Book deleted successfully", 204);
  } catch (error) {
    return handleError(error, "deleteBook");
  }
}
