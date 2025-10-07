import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";

import { getDynamoDBClient } from "../config/dynamodb";
import { Book, CreateBookInput, UpdateBookInput } from "../types/book";
import {
  DatabaseError,
  NotFoundError,
  S3Error,
  ValidationError,
} from "../utils/errors";
import { BookSearchParams, PaginatedResponse } from "../types/pagination";
import { S3Service, s3Service } from "./s3Service";

class BookService {
  private docClient: DynamoDBDocumentClient;
  private tableName: string;
  private s3Service: S3Service;

  constructor() {
    this.docClient = getDynamoDBClient();
    this.tableName = process.env.BOOKS_TABLE!;
    this.s3Service = s3Service;
  }

  // ! TODO: Migrate to QUERY with GSIs instead of SCAN
  async getBookById(bookId: string): Promise<Book> {
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: { id: bookId },
      });

      const result = await this.docClient.send(command);
      if (!result.Item) {
        throw new NotFoundError(`Book with ID ${bookId} not found`);
      }
      const book = result.Item as Book;

      // Generate presigned URL if coverImageKey exists
      if (book.coverImageKey) {
        book.coverImageUrl = await this.s3Service.generateCloudfrontUrlForView(
          book.coverImageKey
        );
      }

      return book;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(
        `Failed to retrieve book: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async createBook(input: CreateBookInput): Promise<{ id: string }> {
    try {
      console.log("Inside try block of createBook");
      const timestamp = new Date().toISOString();
      const book: Book = {
        id: uuidv4(),
        entityType: "BOOK",
        title: input.title,
        description: input.description,
        author: input.author,
        isbn: input.isbn,
        publisher: input.publisher,
        publishedYear: input.publishedYear,
        language: input.language || "English",
        pageCount: input.pageCount,
        category: input.category,
        price: input.price,
        stockQuantity: input.stockQuantity ?? 0,
        coverImageKey: input.coverImageKey,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      const command = new PutCommand({
        TableName: this.tableName,
        Item: book,
      });
      await this.docClient.send(command);
      return { id: book.id };
    } catch (error) {
      throw new DatabaseError(
        `Failed to create book: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async deleteBook(bookId: string): Promise<void> {
    try {
      const existingBook: Book = await this.getBookById(bookId);
      if (!existingBook) {
        throw new NotFoundError(`Book with ID ${bookId} not found`);
      }
      // deleting cover image from S3 if exists
      if (existingBook.coverImageKey) {
        await this.s3Service.deleteImage(existingBook.coverImageKey);
      }
      const command = new DeleteCommand({
        TableName: this.tableName,
        Key: { id: bookId },
      });
      await this.docClient.send(command);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(
        `Failed to delete book: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async updateBook(bookId: string, input: UpdateBookInput): Promise<void> {
    try {
      const existingBook: Book = await this.getBookById(bookId);
      if (!existingBook) {
        throw new NotFoundError(`Book with ID ${bookId} not found`);
      }
      const updatedAt = new Date().toISOString();

      const updateExpressionParts: string[] = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {};

      // Build dynamic update expression for all possible fields
      const fieldsToUpdate: Array<keyof UpdateBookInput> = [
        "title",
        "description",
        "author",
        "category",
        "isbn",
        "publisher",
        "publishedYear",
        "language",
        "pageCount",
        "price",
        "stockQuantity",
        "coverImageKey",
      ];

      fieldsToUpdate.forEach((field) => {
        if (input[field] !== undefined) {
          updateExpressionParts.push(`#${field} = :${field}`);
          expressionAttributeNames[`#${field}`] = field;
          expressionAttributeValues[`:${field}`] = input[field];
        }
      });

      // if updating the cover image, delete the old one from S3
      if (
        input.coverImageKey &&
        existingBook.coverImageKey &&
        existingBook.coverImageKey !== input.coverImageKey
      ) {
        await this.s3Service.deleteImage(existingBook.coverImageKey);
      }

      // Always update the updatedAt timestamp
      updateExpressionParts.push("#updatedAt = :updatedAt");
      expressionAttributeNames["#updatedAt"] = "updatedAt";
      expressionAttributeValues[":updatedAt"] = updatedAt;

      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: { id: bookId },
        UpdateExpression: `SET ${updateExpressionParts.join(", ")}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      });

      await this.docClient.send(command);
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(
        `Failed to update book : ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async generateCoverImageUploadUrl(
    bookId: string,
    fileExtension: string,
    contentType: string
  ): Promise<{ uploadUrl: string; key: string }> {
    try {
      await this.getBookById(bookId); // this will throw NotFoundError

      return await this.s3Service.generatePresignedUrlForUpload(
        bookId,
        fileExtension,
        contentType
      );
    } catch (error) {
      if (error instanceof ValidationError || error instanceof NotFoundError)
        throw error;
      throw new S3Error(
        `Failed to generate upload URL: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async searchBooks(
    params: BookSearchParams
  ): Promise<PaginatedResponse<Book>> {
    try {
      const {
        title,
        author,
        category = "All", // default to "All" if not provided
        minPrice,
        maxPrice,
        limit = 10,
        lastEvaluatedKey,
        sortBy = "updatedAt",
        sortOrder = "desc",
      } = params;

      let queryInput: QueryCommandInput;

      // Determine which GSI to use based on category filter
      if (category) {
        // Use category-based GSI when filtering by category
        const indexName =
          sortBy === "price"
            ? "category-price-index"
            : "category-updatedAt-index";

        queryInput = {
          TableName: this.tableName,
          IndexName: indexName,
          KeyConditionExpression: "#category = :category",
          ExpressionAttributeNames: { "#category": "category" },
          ExpressionAttributeValues: { ":category": category },
          Limit: limit,
          ScanIndexForward: sortOrder === "asc",
        };
      } else {
        // Use entityType-based GSI when querying all books
        const indexName =
          sortBy === "price"
            ? "entityType-price-index"
            : "entityType-updatedAt-index";

        queryInput = {
          TableName: this.tableName,
          IndexName: indexName,
          KeyConditionExpression: "#entityType = :entityType",
          ExpressionAttributeNames: { "#entityType": "entityType" },
          ExpressionAttributeValues: { ":entityType": "BOOK" },
          Limit: limit,
          ScanIndexForward: sortOrder === "asc",
        };
      }

      // Build filter expressions for additional search criteria
      const filterExpressions: string[] = [];
      const filterAttributeNames: Record<string, string> = {
        ...queryInput.ExpressionAttributeNames,
      };
      const filterAttributeValues: Record<string, any> = {
        ...queryInput.ExpressionAttributeValues,
      };

      if (title) {
        filterExpressions.push("contains(#title, :title)");
        filterAttributeNames["#title"] = "title";
        filterAttributeValues[":title"] = title;
      }

      if (author) {
        filterExpressions.push("contains(#author, :author)");
        filterAttributeNames["#author"] = "author";
        filterAttributeValues[":author"] = author;
      }

      if (minPrice !== undefined) {
        filterExpressions.push("#price >= :minPrice");
        filterAttributeNames["#price"] = "price";
        filterAttributeValues[":minPrice"] = minPrice;
      }

      if (maxPrice !== undefined) {
        filterExpressions.push("#price <= :maxPrice");
        filterAttributeNames["#price"] = "price";
        filterAttributeValues[":maxPrice"] = maxPrice;
      }

      if (filterExpressions.length > 0) {
        queryInput.FilterExpression = filterExpressions.join(" AND ");
        queryInput.ExpressionAttributeNames = filterAttributeNames;
        queryInput.ExpressionAttributeValues = filterAttributeValues;
      }

      // decoding the lastEvaluatedKey from base64 string to object as expected by DynamoDB
      if (lastEvaluatedKey) {
        queryInput.ExclusiveStartKey = JSON.parse(
          Buffer.from(lastEvaluatedKey, "base64").toString()
        );
      }

      const command = new QueryCommand(queryInput);
      const result = await this.docClient.send(command);

      // Generate presigned URLs for all books with cover images
      const books = (result.Items || []) as Book[];
      await Promise.all(
        // Promise.all is used to run the async operations in parallel
        books.map(async (book) => {
          if (book.coverImageKey) {
            book.coverImageUrl =
              await this.s3Service.generateCloudfrontUrlForView(
                book.coverImageKey
              );
          }
        })
      );

      // encoding the LastEvaluatedKey to base64 string for safe transport
      const lastKey = result.LastEvaluatedKey
        ? Buffer.from(JSON.stringify(result.LastEvaluatedKey)).toString(
            "base64"
          )
        : undefined;

      return {
        items: books,
        count: result.Count || 0,
        lastEvaluatedKey: lastKey,
        hasMore: !!result.LastEvaluatedKey,
      };
    } catch (error) {
      throw new DatabaseError(
        `Failed to search books: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}

export const bookService = new BookService();
