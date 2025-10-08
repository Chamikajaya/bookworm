import axios from "axios";
import { CognitoTokens, CognitoUserInfo } from "../types/auth";
import { cognitoConfig } from "../config/cognito";
import { decodeToken } from "../utils/jwt";
import { TokenExchangeError, TokenRefreshError } from "../utils/errors";

export class CognitoService {
  private tokenEndpoint: string;

  //   ! TODO:
  constructor() {
    const domain =
      process.env.COGNITO_DOMAIN ||
      `https://bookworm-dev.auth.${cognitoConfig.region}.amazoncognito.com`;
    this.tokenEndpoint = `${domain}/oauth2/token`;
  }

  async exchangeCodeForTokens(
    code: string,
    redirectUri: string
  ): Promise<CognitoTokens> {
    try {
      const response = await axios.post(
        this.tokenEndpoint,
        new URLSearchParams({
          grant_type: "authorization_code",
          client_id: cognitoConfig.clientId,
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
        refreshToken: refreshToken, // Refresh token doesn't change
        idToken: response.data.id_token,
        expiresIn: response.data.expires_in,
      };
    } catch (error: any) {
      throw new TokenRefreshError(error.response?.data?.error || error.message);
    }
  }

  extractUserInfo(idToken: string): CognitoUserInfo | null {
    return decodeToken(idToken);
  }
}

export const cognitoService = new CognitoService();
