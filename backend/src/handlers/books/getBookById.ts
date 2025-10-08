import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { bookService } from "../../service/bookService";
import { logger } from "../../config/logger";
import { successResponse } from "../../utils/response";
import { ValidationError } from "../../utils/errors";
import { handleError } from "../../utils/handleErrors";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    const bookId = event.pathParameters?.id;
    logger.info("Get book by id request received for id " + bookId);

    if (!bookId) {
      throw new ValidationError("Book ID is required");
    }

    const book = await bookService.getBookById(bookId);
    return successResponse(book, "Book retrieved successfully", 200);
  } catch (error) {
    return handleError(error, "getBooksById");
  }
}
