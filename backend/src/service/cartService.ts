import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  DeleteCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { getDynamoDBClient } from "../config/dynamodb";
import {
  CartItem,
  AddToCartInput,
  UpdateCartItemInput,
  CartSummary,
} from "../types/cart";
import { bookService } from "./bookService";
import { DatabaseError, NotFoundError, ValidationError } from "../utils/errors";
import { Book } from "../types/book";

export class CartService {
  private docClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor() {
    this.docClient = getDynamoDBClient();
    this.tableName = process.env.CART_TABLE_NAME!;
  }

  async getCart(userId: string): Promise<CartSummary> {
    try {
      const result = await this.docClient.send(
        new QueryCommand({
          TableName: this.tableName,
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: {
            ":userId": userId,
          },
        })
      );
      const items = (result.Items || []) as CartItem[];
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = items.reduce(
        (sum, item) => sum + item.bookPrice * item.quantity,
        0
      );

      return {
        items,
        totalItems,
        totalPrice: parseFloat(totalPrice.toFixed(2)),
      };
    } catch (error) {
      throw new DatabaseError(
        `Failed to get cart: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  // * The cart is never explicitly "created" as a separate entity. In this dynamo design, a "cart" is simply the collection of items that share the same userId.
  async addToCart(userId: string, input: AddToCartInput): Promise<CartItem> {
    try {
      const existingCartItem = await this.getCartItem(userId, input.bookId);
      // determining the final quantity after addition
      const newQuantity = existingCartItem
        ? existingCartItem.quantity + input.quantity
        : input.quantity;
      const book = await this.validateCartAction(input.bookId, newQuantity);

      const cartItemToAdd: CartItem = {
        userId,
        bookId: input.bookId,
        quantity: existingCartItem
          ? existingCartItem.quantity + input.quantity
          : input.quantity,
        addedAt: existingCartItem?.addedAt || new Date().toISOString(),
        bookTitle: book.title,
        bookPrice: book.price,
        bookAuthor: book.author,
        bookCoverImage: book.coverImageUrl,
      };

      await this.docClient.send(
        new PutCommand({
          TableName: this.tableName,
          Item: cartItemToAdd,
        })
      );

      return cartItemToAdd;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError)
        throw error;
      throw new DatabaseError(
        `Failed to add to cart: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async updateCartItem(
    userId: string,
    bookId: string,
    input: UpdateCartItemInput
  ): Promise<CartItem> {
    try {
      const existingItem = await this.getCartItem(userId, bookId);
      if (!existingItem) throw new NotFoundError("Cart item not found");

      await this.validateCartAction(bookId, input.quantity);

      const result = await this.docClient.send(
        new UpdateCommand({
          TableName: this.tableName,
          Key: { userId, bookId },
          UpdateExpression: "SET quantity = :quantity",
          ExpressionAttributeValues: {
            ":quantity": input.quantity,
          },
          ReturnValues: "ALL_NEW",
        })
      );

      return result.Attributes as CartItem;
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ValidationError)
        throw error;
      throw new DatabaseError(
        `Failed to update cart item: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async removeFromCart(userId: string, bookId: string): Promise<void> {
    try {
      const existingItem = await this.getCartItem(userId, bookId);
      if (!existingItem) throw new NotFoundError("Cart item not found");
      await this.docClient.send(
        new DeleteCommand({
          TableName: this.tableName,
          Key: { userId, bookId },
        })
      );
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(
        `Failed to remove from cart: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  // can not do delete -> userId = :userId since the cart table has a composite key (userId, bookId)
  async clearCart(userId: string): Promise<void> {
    try {
      const cart = await this.getCart(userId);
      if (cart.items.length === 0) return;

      const deleteRequests = cart.items.map((item) => ({
        DeleteRequest: {
          Key: { userId: item.userId, bookId: item.bookId },
        },
      }));

      // DynamoDB BatchWriteItem can handle up to 25 items at a time
      const DYNAMO_DB_BATCH_WRITE_LIMIT = 25;
      const batches = [];
      for (
        let i = 0;
        i < deleteRequests.length;
        i += DYNAMO_DB_BATCH_WRITE_LIMIT
      ) {
        batches.push(deleteRequests.slice(i, i + DYNAMO_DB_BATCH_WRITE_LIMIT));
      }

      for (const batch of batches) {
        await this.docClient.send(
          new BatchWriteCommand({
            RequestItems: {
              [this.tableName]: batch,
            },
          })
        );
      }
    } catch (error) {
      throw new DatabaseError(
        `Failed to clear cart: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  private async getCartItem(
    userId: string,
    bookId: string
  ): Promise<CartItem | null> {
    try {
      const result = await this.docClient.send(
        new QueryCommand({
          TableName: this.tableName,
          KeyConditionExpression: "userId = :userId AND bookId = :bookId",
          ExpressionAttributeValues: {
            ":userId": userId,
            ":bookId": bookId,
          },
        })
      );
      return result.Items && result.Items.length > 0
        ? (result.Items[0] as CartItem)
        : null;
    } catch (error) {
      throw new DatabaseError(
        `Failed to get cart item: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  private async validateCartAction(
    bookId: string,
    desiredQuantity: number
  ): Promise<Book> {
    if (desiredQuantity <= 0)
      throw new ValidationError("Quantity must be greater than zero");

    const book = await bookService.getBookById(bookId);

    if (book.stockQuantity < desiredQuantity) {
      throw new ValidationError(
        `Only ${book.stockQuantity} items left in stock`
      );
    }
    return book;
  }
}

export const cartService = new CartService();
