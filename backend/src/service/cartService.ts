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

export class CartService {
  private docClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor() {
    this.docClient = getDynamoDBClient();
    this.tableName = process.env.CART_TABLE_NAME!;
  }

  //   ! TODO: Need to fix code duplication
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

  async addToCart(userId: string, input: AddToCartInput): Promise<CartItem> {
    try {
      if (input.quantity <= 0) {
        throw new ValidationError("Quantity must be greater than zero");
      }

      const book = await bookService.getBookById(input.bookId); // throws NotFoundError

      if (book.stockQuantity < input.quantity) {
        throw new ValidationError(
          `Only ${book.stockQuantity} items left in stock`
        );
      }

      // checking if the cart item exists already in the cart
      const existingCartItem = await this.getCartItem(userId, input.bookId);

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

      // double check stock if updating existing item
      if (cartItemToAdd.quantity > book.stockQuantity) {
        throw new ValidationError(
          `Only ${book.stockQuantity} items left in stock`
        );
      }

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

      if (input.quantity <= 0)
        throw new ValidationError("Quantity must be greater than zero");

      const book = await bookService.getBookById(bookId); // throws NotFoundError

      if (input.quantity > book.stockQuantity) {
        throw new ValidationError(
          `Only ${book.stockQuantity} items left in stock`
        );
      }

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
}
