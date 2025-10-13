import {
  DynamoDBDocumentClient,
  PutCommand,
  QueryCommand,
  UpdateCommand,
  GetCommand,
} from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { getDynamoDBClient } from "../config/dynamodb";
import { Message, Conversation } from "../types/chat";
import { DatabaseError } from "../utils/errors";

export class ChatService {
  private docClient: DynamoDBDocumentClient;
  private messagesTable: string;
  private conversationsTable: string;

  constructor() {
    this.docClient = getDynamoDBClient();
    this.messagesTable = process.env.MESSAGES_TABLE!;
    this.conversationsTable = process.env.CONVERSATIONS_TABLE!;
  }

  // creating a unique conversationId based on customerId and adminId
  generateConversationId(customerId: string, adminId: string): string {
    return `customer#${customerId}#admin#${adminId}`;
  }

  // saves a new message to the MessagesTable
  async saveMessage(message: Omit<Message, "messageId">): Promise<Message> {
    try {
      const fullMessage: Message = {
        ...message,
        messageId: uuidv4(),
      };

      await this.docClient.send(
        new PutCommand({
          TableName: this.messagesTable,
          Item: fullMessage,
        })
      );

      return fullMessage;
    } catch (error) {
      throw new DatabaseError(
        `Failed to save message: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  // retrieves the chat history for a specific conversation with pagination support
  async getMessages(
    conversationId: string,
    limit: number = 50,
    lastTimestamp?: number
  ): Promise<Message[]> {
    try {
      const params: any = {
        TableName: this.messagesTable,
        KeyConditionExpression: "conversationId = :conversationId", // queries the messages by conversationId
        ExpressionAttributeValues: {
          ":conversationId": conversationId,
        },
        Limit: limit,
        ScanIndexForward: false, // Most recent first
      };

      //   ! TODO:  Use Query Response's LastEvaluatedKey for pagination instead of lastTimestamp
      if (lastTimestamp) {
        params.ExclusiveStartKey = {
          // possible since messages table has conversationId as partition key and timestamp as sort key
          conversationId,
          timestamp: lastTimestamp,
        };
      }

      const result = await this.docClient.send(new QueryCommand(params));
      const messages = (result.Items || []) as Message[];
      return messages.reverse(); // Return chronological order -> oldest first
    } catch (error) {
      throw new DatabaseError(
        `Failed to get messages: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //   ! TODO: Create dto type for the request body ?
  async createOrUpdateConversation(
    customerId: string,
    customerName: string,
    customerEmail: string,
    adminId: string,
    adminName: string,
    lastMessage: {
      content: string;
      senderId: string;
      senderName: string;
      timestamp: string;
    }
  ): Promise<Conversation> {
    try {
      const conversationId = this.generateConversationId(customerId, adminId);
      const existing = await this.getConversation(conversationId);

      if (existing) {
        // Update existing conversation
        const increment =
          lastMessage.senderId === customerId ? "admin" : "customer";
        const result = await this.docClient.send(
          new UpdateCommand({
            TableName: this.conversationsTable,
            Key: { conversationId },
            UpdateExpression: `SET lastMessage = :lastMessage, updatedAt = :updatedAt, unreadCount.#role = unreadCount.#role + :inc`,
            ExpressionAttributeNames: {
              "#role": increment,
            },
            ExpressionAttributeValues: {
              ":lastMessage": lastMessage,
              ":updatedAt": Date.now(),
              ":inc": 1,
            },
            ReturnValues: "ALL_NEW",
          })
        );
        return result.Attributes as Conversation;
      } else {
        // Create new conversation
        const conversation: Conversation = {
          conversationId,
          customerId,
          customerName,
          customerEmail,
          adminId,
          adminName,
          lastMessage,
          unreadCount: {
            customer: lastMessage.senderId === adminId ? 1 : 0,
            admin: lastMessage.senderId === customerId ? 1 : 0,
          },
          createdAt: String(Date.now()),
          updatedAt: String(Date.now()),
          status: "active",
        };

        await this.docClient.send(
          new PutCommand({
            TableName: this.conversationsTable,
            Item: conversation,
          })
        );

        return conversation;
      }
    } catch (error) {
      throw new DatabaseError(
        `Failed to create/update conversation: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async getConversation(conversationId: string): Promise<Conversation | null> {
    try {
      const result = await this.docClient.send(
        new GetCommand({
          TableName: this.conversationsTable,
          Key: { conversationId },
        })
      );
      return result.Item ? (result.Item as Conversation) : null;
    } catch (error) {
      throw new DatabaseError(
        `Failed to get conversation: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async getConversationsByAdmin(adminId: string): Promise<Conversation[]> {
    try {
      const result = await this.docClient.send(
        new QueryCommand({
          TableName: this.conversationsTable,
          IndexName: "adminId-updatedAt-index",
          KeyConditionExpression: "adminId = :adminId",
          ExpressionAttributeValues: {
            ":adminId": adminId,
          },
          ScanIndexForward: false, // Most recent first
        })
      );
      return (result.Items || []) as Conversation[];
    } catch (error) {
      throw new DatabaseError(
        `Failed to get conversations: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async getConversationByCustomer(
    customerId: string
  ): Promise<Conversation | null> {
    try {
      const result = await this.docClient.send(
        new QueryCommand({
          TableName: this.conversationsTable,
          IndexName: "customerId-index",
          KeyConditionExpression: "customerId = :customerId",
          ExpressionAttributeValues: {
            ":customerId": customerId,
          },
          Limit: 1,
        })
      );
      return result.Items && result.Items.length > 0
        ? (result.Items[0] as Conversation)
        : null;
    } catch (error) {
      throw new DatabaseError(
        `Failed to get conversation: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async markMessagesAsRead(
    conversationId: string,
    recipientId: string
  ): Promise<void> {
    try {
      const messages = await this.getUnreadMessages(
        conversationId,
        recipientId
      );
      const readAt = Date.now();

      for (const message of messages) {
        await this.docClient.send(
          new UpdateCommand({
            TableName: this.messagesTable,
            Key: {
              conversationId: message.conversationId,
              timestamp: message.timestamp,
            },
            UpdateExpression: "SET #read = :read, readAt = :readAt",
            ExpressionAttributeNames: {
              "#read": "read",
            },
            ExpressionAttributeValues: {
              ":read": "true",
              ":readAt": readAt,
            },
          })
        );
      }

      // Reset unread count
      const role = messages[0]?.senderRole === "ADMIN" ? "customer" : "admin";
      await this.docClient.send(
        new UpdateCommand({
          TableName: this.conversationsTable,
          Key: { conversationId },
          UpdateExpression: "SET unreadCount.#role = :zero",
          ExpressionAttributeNames: {
            "#role": role,
          },
          ExpressionAttributeValues: {
            ":zero": 0,
          },
        })
      );
    } catch (error) {
      throw new DatabaseError(
        `Failed to mark messages as read: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async getUnreadMessages(
    conversationId: string,
    recipientId: string
  ): Promise<Message[]> {
    try {
      const result = await this.docClient.send(
        new QueryCommand({
          TableName: this.messagesTable,
          KeyConditionExpression: "conversationId = :conversationId",
          FilterExpression: "recipientId = :recipientId AND #read = :read",
          ExpressionAttributeNames: {
            "#read": "read",
          },
          ExpressionAttributeValues: {
            ":conversationId": conversationId,
            ":recipientId": recipientId,
            ":read": "false",
          },
        })
      );
      return (result.Items || []) as Message[];
    } catch (error) {
      throw new DatabaseError(
        `Failed to get unread messages: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  //   ! TODO: This is for admin side only right ? Not for customer side ?
  async getUnreadCount(userId: string): Promise<number> {
    try {
      // Get all conversations for user
      const result = await this.docClient.send(
        new QueryCommand({
          TableName: this.conversationsTable,
          IndexName: "adminId-updatedAt-index",
          KeyConditionExpression: "adminId = :userId",
          ExpressionAttributeValues: {
            ":userId": userId,
          },
        })
      );

      const conversations = (result.Items || []) as Conversation[];
      return conversations.reduce(
        (sum, conv) => sum + conv.unreadCount.admin,
        0
      );
    } catch (error) {
      throw new DatabaseError(
        `Failed to get unread count: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}

export const chatService = new ChatService();
