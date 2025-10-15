import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";
import { getDynamoDBClient } from "../config/dynamodb";
import { User, UpdateUserInput, UserRole } from "../types/user";
import { CognitoUserInfo } from "../types/auth";
import { DatabaseError, NotFoundError } from "../utils/errors";
import { getAdminEmail } from "../utils/secrets";
import { emailService } from "./emailService";

export class UserService {
  private docClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor() {
    this.docClient = getDynamoDBClient();
    this.tableName = process.env.USERS_TABLE!;
  }

  private async determineRole(email: string): Promise<UserRole> {
    const adminEmail = await getAdminEmail();
    return email.toLowerCase() === adminEmail.toLowerCase()
      ? UserRole.ADMIN
      : UserRole.CUSTOMER;
  }

  async createUser(cognitoUser: CognitoUserInfo): Promise<User> {
    try {
      const timestamp = new Date().toISOString();
      const role = await this.determineRole(cognitoUser.email);

      const user: User = {
        userId: cognitoUser.sub,
        email: cognitoUser.email,
        name: cognitoUser.name,
        profileImage: cognitoUser.picture,
        role,
        createdAt: timestamp,
        updatedAt: timestamp,
      };

      await this.docClient.send(
        new PutCommand({
          TableName: this.tableName,
          Item: user,
          ConditionExpression: "attribute_not_exists(userId)",
        })
      );

      await emailService.verifyEmailIdentity(cognitoUser.email);

      return user;
    } catch (error: any) {
      if (error.name === "ConditionalCheckFailedException") {
        return this.getUserById(cognitoUser.sub);
      }
      throw new DatabaseError(`Failed to create user: ${error.message}`);
    }
  }

  async getUserById(userId: string): Promise<User> {
    try {
      const result = await this.docClient.send(
        new GetCommand({
          TableName: this.tableName,
          Key: { userId },
        })
      );

      if (!result.Item) {
        throw new NotFoundError(`User with ID ${userId} not found`);
      }

      return result.Item as User;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(
        `Failed to get user: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.docClient.send(
        new QueryCommand({
          TableName: this.tableName,
          IndexName: "email-index",
          KeyConditionExpression: "email = :email",
          ExpressionAttributeValues: {
            ":email": email,
          },
          Limit: 1,
        })
      );

      return result.Items && result.Items.length > 0
        ? (result.Items[0] as User)
        : null;
    } catch (error) {
      throw new DatabaseError(
        `Failed to get user by email: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async updateUser(userId: string, input: UpdateUserInput): Promise<User> {
    try {
      await this.getUserById(userId); // will throw NotFoundError if user doesn't exist

      const updatedAt = new Date().toISOString();

      const updateExpressionParts: string[] = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {};

      if (input.phoneNumber !== undefined) {
        updateExpressionParts.push("#phoneNumber = :phoneNumber");
        expressionAttributeNames["#phoneNumber"] = "phoneNumber";
        expressionAttributeValues[":phoneNumber"] = input.phoneNumber;
      }

      if (input.address !== undefined) {
        updateExpressionParts.push("#address = :address");
        expressionAttributeNames["#address"] = "address";
        expressionAttributeValues[":address"] = input.address;
      }

      updateExpressionParts.push("#updatedAt = :updatedAt");
      expressionAttributeNames["#updatedAt"] = "updatedAt";
      expressionAttributeValues[":updatedAt"] = updatedAt;

      const result = await this.docClient.send(
        new UpdateCommand({
          TableName: this.tableName,
          Key: { userId },
          UpdateExpression: `SET ${updateExpressionParts.join(", ")}`,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
          ReturnValues: "ALL_NEW",
        })
      );

      return result.Attributes as User;
    } catch (error) {
      if (error instanceof NotFoundError) throw error;
      throw new DatabaseError(
        `Failed to update user: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  async updateLastLogin(userId: string): Promise<void> {
    try {
      await this.docClient.send(
        new UpdateCommand({
          TableName: this.tableName,
          Key: { userId },
          UpdateExpression: "SET #updatedAt = :updatedAt",
          ExpressionAttributeNames: {
            "#updatedAt": "updatedAt",
          },
          ExpressionAttributeValues: {
            ":updatedAt": new Date().toISOString(),
          },
        })
      );
    } catch (error) {
      throw new DatabaseError(
        `Failed to update last login: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }
}

export const userService = new UserService();
