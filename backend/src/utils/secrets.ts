import { GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { client } from "../config/secretManager";

let cachedSecrets: {
  adminEmail?: string;
} = {};

export const getAdminEmail = async (): Promise<string> => {
  if (cachedSecrets.adminEmail) {
    return cachedSecrets.adminEmail;
  }

  const stage = process.env.STAGE || "dev";
  const secretName = `bookworm/${stage}/admin-email`;

  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await client.send(command);

    if (!response.SecretString) {
      throw new Error("Secret string is empty");
    }

    cachedSecrets.adminEmail = response.SecretString;
    return response.SecretString;
  } catch (error) {
    console.error("Error fetching admin email:", error);
    throw error;
  }
};
