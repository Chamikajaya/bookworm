import { SQSClient } from "@aws-sdk/client-sqs";

let sqsClient: SQSClient | null = null;

export const getSQSClient = (): SQSClient => {
  if (!sqsClient) {
    sqsClient = new SQSClient({
      region: process.env.AWS_REGION || "us-east-1",
    });
  }
  return sqsClient;
};
