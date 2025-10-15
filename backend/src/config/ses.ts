import { SESClient } from "@aws-sdk/client-ses";

let sesClient: SESClient | null = null;

export const getSESClient = (): SESClient => {
  if (!sesClient) {
    sesClient = new SESClient({
      region: process.env.AWS_REGION || "us-east-1",
    });
  }
  return sesClient;
};
