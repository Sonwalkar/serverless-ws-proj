import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
} from "@aws-sdk/client-apigatewaymanagementapi";

const postToConnection = async (
  url: string,
  connectionId: string,
  data: any
) => {
  const apiGatewayClient = new ApiGatewayManagementApiClient({
    apiVersion: "2018-11-29",
    endpoint: url,
  });

  const input = {
    Data: JSON.stringify(data),
    ConnectionId: connectionId,
  };

  const command = new PostToConnectionCommand(input);
  const response = await apiGatewayClient.send(command);
  return response;
};

export { postToConnection };
