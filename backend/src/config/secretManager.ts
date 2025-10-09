import { SecretsManagerClient } from "@aws-sdk/client-secrets-manager";

export const client = new SecretsManagerClient({
  region: process.env.AWS_REGION || "us-east-1",
});
