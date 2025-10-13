export const cognitoConfig = {
  userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
  clientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
  domain: import.meta.env.VITE_COGNITO_DOMAIN,
  redirectUri: import.meta.env.VITE_OAUTH_REDIRECT_URI,
  scope: ["email", "openid", "profile"],
};

export const getAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: cognitoConfig.clientId,
    response_type: "code",
    scope: cognitoConfig.scope.join(" "),
    redirect_uri: cognitoConfig.redirectUri,
  });

  return `${cognitoConfig.domain}/oauth2/authorize?${params.toString()}`;
};
