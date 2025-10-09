import axios from "axios";
import { CognitoTokens, CognitoUserInfo } from "../types/auth";
import { cognitoConfig } from "../config/cognito";
import { decodeToken } from "../utils/jwt";
import { TokenExchangeError, TokenRefreshError } from "../utils/errors";
import { logger } from "../config/logger";

export class CognitoService {
  private tokenEndpoint: string;

  constructor() {
    // Use the domain from outputs (will be set after first deployment)
    const domain =
      process.env.COGNITO_DOMAIN ||
      `https://bookworm-${process.env.STAGE || "dev"}-${
        process.env.INSTANCE_ID || "unknown"
      }.auth.${cognitoConfig.region}.amazoncognito.com`;

    this.tokenEndpoint = `${domain}/oauth2/token`;

    logger.info("Cognito service initialized", {
      tokenEndpoint: this.tokenEndpoint,
    });
  }

  async exchangeCodeForTokens(
    code: string,
    redirectUri: string
  ): Promise<CognitoTokens> {
    try {
      // !  Use COGNITO_CLIENT_ID from environment, not Google's client_id!
      const cognitoClientId = cognitoConfig.clientId; // This uses process.env.COGNITO_CLIENT_ID

      logger.info("Token exchange attempt", {
        tokenEndpoint: this.tokenEndpoint,
        clientId: cognitoClientId,
        redirectUri,
      });

      const response = await axios.post(
        this.tokenEndpoint,
        new URLSearchParams({
          grant_type: "authorization_code",
          client_id: cognitoClientId, // Use Cognito's client ID
          code,
          redirect_uri: redirectUri,
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        idToken: response.data.id_token,
        expiresIn: response.data.expires_in,
      };
    } catch (error: any) {
      logger.error("Token exchange failed", {
        error: error.response?.data || error.message,
        status: error.response?.status,
      });
      throw new TokenExchangeError(
        error.response?.data?.error || error.message
      );
    }
  }

  async refreshAccessToken(refreshToken: string): Promise<CognitoTokens> {
    try {
      const response = await axios.post(
        this.tokenEndpoint,
        new URLSearchParams({
          grant_type: "refresh_token",
          client_id: cognitoConfig.clientId,
          refresh_token: refreshToken,
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: refreshToken,
        idToken: response.data.id_token,
        expiresIn: response.data.expires_in,
      };
    } catch (error: any) {
      logger.error("Token refresh failed", {
        error: error.response?.data || error.message,
      });
      throw new TokenRefreshError(error.response?.data?.error || error.message);
    }
  }

  extractUserInfo(idToken: string): CognitoUserInfo | null {
    return decodeToken(idToken);
  }
}

export const cognitoService = new CognitoService();
