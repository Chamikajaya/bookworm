import { ApiGatewayManagementApiClient } from "@aws-sdk/client-apigatewaymanagementapi";

let apiGatewayClient: ApiGatewayManagementApiClient | null = null;

export const getApiGatewayClient = (): ApiGatewayManagementApiClient => {
  if (!apiGatewayClient) {
    const endpoint = process.env.WEBSOCKET_ENDPOINT;
    if (!endpoint) {
      throw new Error("WEBSOCKET_ENDPOINT not configured");
    }
    apiGatewayClient = new ApiGatewayManagementApiClient({
      endpoint: endpoint.replace("wss://", "https://"),
    });
  }
  return apiGatewayClient;
};
