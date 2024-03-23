import {
  ApiGatewayManagementApiClient,
  PostToConnectionCommand,
  DeleteConnectionCommand,
  DeleteConnectionRequest,
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

const deleteConnection = async (url: string, connectionId: string) => {
  const apiGatewayClient = new ApiGatewayManagementApiClient({
    apiVersion: "2018-11-29",
    endpoint: url,
  });

  const input: DeleteConnectionRequest = {
    ConnectionId: connectionId,
  };

  const command = new DeleteConnectionCommand(input);
  const response = await apiGatewayClient.send(command);
  return response;
};

export { postToConnection, deleteConnection };
