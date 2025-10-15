import { SendMessageCommand, SQSClient } from "@aws-sdk/client-sqs";
import { logger } from "../config/logger";
import { getSQSClient } from "../config/sqs";
import { getAdminEmail } from "../utils/secrets";
import { EmailMessage, EmailType, statusMessages } from "../types/email";
import { QueueError } from "../utils/errors";
import { Order, OrderItem } from "../types/order";

export class QueueService {
  private sqsClient: SQSClient;
  private queueUrl: string;

  constructor() {
    this.sqsClient = getSQSClient();
    this.queueUrl = process.env.EMAIL_QUEUE_URL!;
  }

  async sendOrderConfirmationToCustomerToQueue(
    order: Order,
    items: OrderItem[]
  ): Promise<void> {
    try {
      await this.queueEmail({
        type: EmailType.ORDER_CONFIRMATION_CUSTOMER,
        to: order.userEmail,
        subject: `Order Confirmation - #${order.orderId.slice(0, 8)}`,
        data: {
          orderNumber: order.orderId.slice(0, 8),
          customerName: order.userName,
          totalAmount: order.totalAmount,
          items: items.map((item) => ({
            title: item.bookTitle,
            author: item.bookAuthor,
            quantity: item.quantity,
            price: item.bookPrice,
          })),
          shippingAddress: order.shippingAddress,
        },
      });

      logger.info("Queued order confirmation email to customer", {
        orderId: order.orderId,
        userEmail: order.userEmail,
      });
    } catch (error) {
      // NOT THROWING ERROR TO AVOID FAILING THE ORDER PROCESS
      logger.error("Failed to send order confirmation email to customer", {
        orderId: order.orderId,
        error,
      });
    }
  }

  async sendOrderConfirmationToAdminToQueue(
    order: Order,
    items: OrderItem[]
  ): Promise<void> {
    try {
      await this.queueEmail({
        type: EmailType.ORDER_CONFIRMATION_ADMIN,
        to: await getAdminEmail(),
        subject: `New Order Placed - #${order.orderId.slice(0, 8)}`,
        data: {
          orderNumber: order.orderId.slice(0, 8),
          customerName: order.userName,
          customerEmail: order.userEmail,
          totalAmount: order.totalAmount,
          items: items.map((item) => ({
            title: item.bookTitle,
            quantity: item.quantity,
            price: item.bookPrice,
          })),
          shippingAddress: order.shippingAddress,
        },
      });
      logger.info("Queued order confirmation email to admin", {
        orderId: order.orderId,
      });
    } catch (error) {
      // NOT THROWING ERROR TO AVOID FAILING THE ORDER PROCESS
      logger.error("Failed to send order confirmation email to admin", {
        orderId: order.orderId,
        error,
      });
    }
  }

  async sendOrderStatusUpdateToQueue(order: Order): Promise<void> {
    try {
      await this.queueEmail({
        type: EmailType.ORDER_STATUS_UPDATE,
        to: order.userEmail,
        subject: `Order Update - #${order.orderId.slice(0, 8)}`,
        data: {
          orderNumber: order.orderId.slice(0, 8),
          customerName: order.userName,
          status: order.status,
          statusMessage:
            statusMessages[order.status] ||
            "Your order status has been updated.",
        },
      });
    } catch (error) {
      // NOT THROWING ERROR TO AVOID FAILING THE ORDER PROCESS
      logger.error("Failed to send order status update email to customer", {
        orderId: order.orderId,
        error,
      });
    }
  }

  private async queueEmail(message: EmailMessage): Promise<void> {
    try {
      await this.sqsClient.send(
        new SendMessageCommand({
          QueueUrl: this.queueUrl,
          MessageBody: JSON.stringify(message),
          MessageAttributes: {
            emailType: {
              DataType: "String",
              StringValue: message.type,
            },
          },
        })
      );
    } catch (error) {
      throw new QueueError(`Failed to queue email: ${error}`);
    }
  }
}

export const queueService = new QueueService();
