import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { bookService } from "../../service/bookService";
import { logger } from "../../config/logger";
import { successResponse } from "../../utils/response";
import { handleError } from "../../utils/handleErrors";
import { BookSearchParams, SortBy, SortOrder } from "../../types/pagination";

export async function handler(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    logger.info("Get all books request received with params", {
      queryParams: event.queryStringParameters,
    });

    const sortBy = (event.queryStringParameters?.sortBy ||
      "updatedAt") as SortBy;
    const sortOrder = (event.queryStringParameters?.sortOrder ||
      "desc") as SortOrder;

    const searchParams: BookSearchParams = {
      title: event.queryStringParameters?.title,
      author: event.queryStringParameters?.author,
      category: event.queryStringParameters?.category,
      minPrice: event.queryStringParameters?.minPrice
        ? parseFloat(event.queryStringParameters.minPrice)
        : undefined,

      maxPrice: event.queryStringParameters?.maxPrice
        ? parseFloat(event.queryStringParameters.maxPrice)
        : undefined,
      limit: event.queryStringParameters?.limit
        ? parseInt(event.queryStringParameters.limit)
        : 10,
      lastEvaluatedKey: event.queryStringParameters?.lastKey,
      sortBy,
      sortOrder,
    };

    const result = await bookService.searchBooks(searchParams);

    return successResponse(result, "Books retrieved successfully", 200);
  } catch (error) {
    return handleError(error, "getAllBooks");
  }
}
