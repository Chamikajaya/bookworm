import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";
import {
  DynamoDBDocumentClient,
  PutCommand,
  DeleteCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { getDynamoDBClient } from "../config/dynamodb";
import { getApiGatewayClient } from "../config/apiGatewayManagementApiClient";
import { Connection } from "../types/chat";
import { DatabaseError } from "../utils/errors";

export class WebSocketService {
  private docClient: DynamoDBDocumentClient;
  private connectionsTable: string; // * all active WebSocket connections are stored here
  private apiGatewayClient: ApiGatewayManagementApiClient;

  constructor() {
    this.docClient = getDynamoDBClient();
    this.apiGatewayClient = getApiGatewayClient();
    this.connectionsTable = process.env.CONNECTIONS_TABLE!;
  }

  // persists a new ws connection to the ConnectionsTable
  async saveConnection(connection: Connection): Promise<void> {
    try {
      const ttl = Math.floor(Date.now() / 1000) + 86400; // 24 hours -> auto delete after 24 hours of inactivity - for cleaning up stale connections (refer serverless.yml -> ConnectionsTable -> TimeToLiveSpecification)
      await this.docClient.send(
        new PutCommand({
          TableName: this.connectionsTable,
          Item: { ...connection, ttl },
        })
      );
    } catch (error) {
      throw new DatabaseError(
        `Failed to save connection: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  // removes a ws connection from the ConnectionsTable when a user disconnects
  async deleteConnection(connectionId: string): Promise<void> {
    try {
      await this.docClient.send(
        new DeleteCommand({
          TableName: this.connectionsTable,
          Key: { connectionId },
        })
      );
    } catch (error) {
      throw new DatabaseError(
        `Failed to delete connection: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  // retrieves all active connections for a specific user
  async getConnectionsByUserId(userId: string): Promise<Connection[]> {
    try {
      const result = await this.docClient.send(
        new QueryCommand({
          TableName: this.connectionsTable,
          IndexName: "userId-index",
          KeyConditionExpression: "userId = :userId",
          ExpressionAttributeValues: {
            ":userId": userId,
          },
        })
      );
      return (result.Items || []) as Connection[];
    } catch (error) {
      throw new DatabaseError(
        `Failed to get connections: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /* SENDING MESSAGES OVER WEBSOCKET */

  // sending a message to a specific connection
  async sendToConnection(connectionId: string, data: any): Promise<boolean> {
    try {
      await this.apiGatewayClient.send(
        new PostToConnectionCommand({
          ConnectionId: connectionId,
          Data: Buffer.from(JSON.stringify(data)),
        })
      );
      return true;
    } catch (error: any) {
      // 410 === target connection is gone
      if (error.statusCode === 410) {
        // Connection is stale, remove it
        await this.deleteConnection(connectionId);
        return false;
      }
      throw new WebSocketError(
        `Failed to send to connection ${connectionId}: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  // broadcasting a message to all active connections of a specific user -> user may have multiple active connections (e.g., multiple devices, syncing read receipts )
  async broadcastToUser(userId: string, data: any): Promise<number> {
    const connections = await this.getConnectionsByUserId(userId);
    let successCount = 0;

    for (const connection of connections) {
      const sent = await this.sendToConnection(connection.connectionId, data);
      if (sent) successCount++;
    }

    return successCount;
  }
}

export const websocketService = new WebSocketService();
