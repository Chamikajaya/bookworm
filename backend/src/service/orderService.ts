import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  UpdateCommand,
  BatchWriteCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { getDynamoDBClient } from "../config/dynamodb";
import {
  Order,
  OrderItem,
  OrderStatus,
  CreateOrderInput,
  UpdateOrderStatusInput,
  OrderWithItems,
  StatusHistoryEntry,
} from "../types/order";
import { cartService } from "./cartService";
import {
  AuthorizationError,
  DatabaseError,
  NotFoundError,
  ValidationError,
} from "../utils/errors";
import { logger } from "../config/logger";

export class OrderService {
  private docClient: DynamoDBDocumentClient;
  private ordersTable: string;
  private orderItemsTable: string;

  constructor() {
    this.docClient = getDynamoDBClient();
    this.ordersTable = process.env.ORDERS_TABLE!;
    this.orderItemsTable = process.env.ORDER_ITEMS_TABLE!;
  }

  async getOrderById(
    orderId: string,
    userId?: string
  ): Promise<OrderWithItems> {
    try {
      const result = await this.docClient.send(
        new GetCommand({
          TableName: this.ordersTable,
          Key: { orderId },
        })
      );

      if (!result.Item) {
        throw new NotFoundError("Order not found");
      }

      const order = result.Item as Order;

      // Verify ownership if userId provided
      if (userId && order.userId !== userId) {
        throw new AuthorizationError("Access denied");
      }

      // Get order items in the order
      const items = await this.getOrderItems(orderId);

      return { order, items };
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof AuthorizationError)
        throw error;
      throw new DatabaseError(
        `Failed to get order: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //   ! TODO: Pagination like book service ?
  async getOrdersByUser(userId: string, limit: number = 20): Promise<Order[]> {
    try {
      const result = await this.docClient.send(
        new QueryCommand({
          TableName: this.ordersTable,
          IndexName: "userId-createdAt-index",
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: {
            ":userId": userId,
          },
          Limit: limit,
          ScanIndexForward: false, // Most recent first
        })
      );

      return (result.Items || []) as Order[];
    } catch (error) {
      throw new DatabaseError(
        `Failed to get orders: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //   ! TODO: Pagination like book service ?
  async getAllOrders(
    status?: OrderStatus,
    limit: number = 50
  ): Promise<Order[]> {
    try {
      const expressionAttValues = status
        ? { ":status": status }
        : { ":status": "PENDING" }; // Default to PENDING if no status provided

      const result = await this.docClient.send(
        new QueryCommand({
          TableName: this.ordersTable,
          IndexName: "status-createdAt-index",
          KeyConditionExpression: "status = :status",
          ExpressionAttributeValues: expressionAttValues,
          Limit: limit,
          ScanIndexForward: false, // Most recent first
        })
      );
      return (result.Items || []) as Order[];
    } catch (error) {
      throw new DatabaseError(
        `Failed to get all orders: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async createOrder(
    userId: string,
    userEmail: string,
    userName: string,
    input: CreateOrderInput
  ): Promise<OrderWithItems> {
    try {
      // Get user's cart
      const cart = await cartService.getCart(userId);

      if (cart.items.length === 0) {
        throw new ValidationError("Cart is empty");
      }

      const orderId = uuidv4();
      const timestamp = Date.now();

      // Create order
      const order: Order = {
        orderId,
        userId,
        userEmail,
        userName,
        status: OrderStatus.PENDING,
        totalAmount: cart.totalPrice,
        shippingAddress: input.shippingAddress,
        createdAt: timestamp,
        updatedAt: timestamp,
        statusHistory: [
          {
            status: OrderStatus.PENDING,
            timestamp,
            note: "Order placed",
          },
        ],
      };

      await this.docClient.send(
        new PutCommand({
          TableName: this.ordersTable,
          Item: order,
        })
      );

      // Create order items
      const orderItems: OrderItem[] = cart.items.map((item) => ({
        orderId,
        bookId: item.bookId,
        bookTitle: item.bookTitle,
        bookAuthor: item.bookAuthor,
        bookPrice: item.bookPrice,
        quantity: item.quantity,
        subtotal: item.bookPrice * item.quantity,
        bookImage: item.bookCoverImage,
      }));

      const putRequests = orderItems.map((item) => ({
        PutRequest: {
          Item: item,
        },
      }));

      // Batch write order items
      const DYNAMO_DB_BATCH_WRITE_LIMIT = 25;
      for (
        let i = 0;
        i < putRequests.length;
        i += DYNAMO_DB_BATCH_WRITE_LIMIT
      ) {
        const batch = putRequests.slice(i, i + DYNAMO_DB_BATCH_WRITE_LIMIT);
        await this.docClient.send(
          new BatchWriteCommand({
            RequestItems: {
              [this.orderItemsTable]: batch,
            },
          })
        );
      }

      // Clear cart
      await cartService.clearCart(userId);

      // ! TODO: Send order confirmation email here

      logger.info("Order created successfully", { orderId, userId });

      return { order, items: orderItems };
    } catch (error) {
      if (error instanceof ValidationError) throw error;
      throw new DatabaseError(
        `Failed to create order: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async updateOrderStatus(
    orderId: string,
    input: UpdateOrderStatusInput
  ): Promise<Order> {
    try {
      const { order } = await this.getOrderById(orderId);

      const timestamp = Date.now();
      const newHistoryEntry: StatusHistoryEntry = {
        status: input.status,
        timestamp,
        note: input.note,
      };

      const updatedHistory = [...order.statusHistory, newHistoryEntry];

      const result = await this.docClient.send(
        new UpdateCommand({
          TableName: this.ordersTable,
          Key: { orderId },
          UpdateExpression:
            "SET #status = :status, updatedAt = :updatedAt, statusHistory = :statusHistory",
          ExpressionAttributeNames: {
            "#status": "status",
          },
          ExpressionAttributeValues: {
            ":status": input.status,
            ":updatedAt": timestamp,
            ":statusHistory": updatedHistory,
          },
          ReturnValues: "ALL_NEW",
        })
      );

      const updatedOrder = result.Attributes as Order;

      //   ! TODO: Need to send the email notification here since the order status has changed

      logger.info("Order status updated", { orderId, status: input.status });

      return updatedOrder;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(
        `Failed to update order status: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  private async getOrderItems(orderId: string): Promise<OrderItem[]> {
    try {
      const result = await this.docClient.send(
        new QueryCommand({
          TableName: this.orderItemsTable,
          KeyConditionExpression: "orderId = :orderId",
          ExpressionAttributeValues: {
            ":orderId": orderId,
          },
        })
      );
      return (result.Items || []) as OrderItem[];
    } catch (error) {
      throw new DatabaseError(
        `Failed to get order items: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}

export const orderService = new OrderService();
