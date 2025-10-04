// ! TODO: Update serverless.yml as well accordingly

import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";

import { getDynamoDBClient } from "../config/dynamodb";

export class BookService {
  private docClient: DynamoDBDocumentClient;
  private tableName: string;

  constructor() {
    this.docClient = getDynamoDBClient();
    this.tableName = process.env.BOOKS_TABLE;
  }
}
