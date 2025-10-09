import { GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { client } from "../config/secretManager";

export interface GoogleOAuthSecrets {
  client_id: string;
  client_secret: string;
}

let cachedSecrets: {
  googleOAuth?: GoogleOAuthSecrets;
  adminEmail?: string;
} = {};

export const getGoogleOAuthSecrets = async (): Promise<GoogleOAuthSecrets> => {
  if (cachedSecrets.googleOAuth) {
    return cachedSecrets.googleOAuth;
  }

  const stage = process.env.STAGE || "dev";
  const secretName = `bookworm/${stage}/google-oauth`;

  try {
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const response = await client.send(command);

    if (!response.SecretString) {
      throw new Error("Secret string is empty");
    }

    const secrets = JSON.parse(response.SecretString) as GoogleOAuthSecrets;
    cachedSecrets.googleOAuth = secrets;
    return secrets;
  } catch (error) {
    console.error("Error fetching Google OAuth secrets:", error);
    throw error;
  }
};

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
