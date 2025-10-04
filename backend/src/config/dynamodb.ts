import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

let docClient: DynamoDBDocumentClient | null = null;

export const getDynamoDBClient = (): DynamoDBDocumentClient => {
  if (!docClient) {
    const client = new DynamoDBClient({
      region: process.env.AWS_REGION || "us-east-1",
    });

    docClient = DynamoDBDocumentClient.from(client, {
      // Marshall = convert a plain JavaScript object into DynamoDB's AttributeValue shape that the low‑level API expects (e.g. { id: "1", count: 42 } -> { id: { S: "1" }, count: { N: "42" } }).
      // Unmarshall = convert DynamoDB AttributeValue results back into plain JavaScript objects.
      marshallOptions: {
        removeUndefinedValues: true, // Remove undefined values
      },
      unmarshallOptions: {
        wrapNumbers: false, // Don't wrap numbers in objects
      },
    });
  }

  return docClient;
};
