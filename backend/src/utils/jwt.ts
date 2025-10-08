import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { cognitoConfig } from "../config/cognito";
import { CognitoUserInfo } from "../types/auth";

const client = jwksClient({
  jwksUri: `${cognitoConfig.issuer}/.well-known/jwks.json`,
  cache: true,
  cacheMaxAge: 86400000, // 24 hours
});

function getKey(header: jwt.JwtHeader, callback: jwt.SigningKeyCallback) {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      callback(err);
      return;
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
}

export const verifyToken = (token: string): Promise<CognitoUserInfo> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      getKey,
      {
        issuer: cognitoConfig.issuer,
        audience: cognitoConfig.clientId,
        algorithms: ["RS256"],
      },
      (err, decoded) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(decoded as CognitoUserInfo);
      }
    );
  });
};

export const decodeToken = (token: string): CognitoUserInfo | null => {
  try {
    return jwt.decode(token) as CognitoUserInfo;
  } catch {
    return null;
  }
};
