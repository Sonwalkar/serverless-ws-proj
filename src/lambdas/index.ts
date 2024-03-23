import { deleteConnection, postToConnection } from "./apiGatewayCommands";
import {
  addNewConnectionCommand,
  getAllActiveConnectionCommand,
} from "./dynamoDBCommands";

const sendToOne = async (url: string, connectionId: string, data: any) => {
  const agResponse = await postToConnection(url, connectionId, data);
  console.log("🚀 ~ sendToOne ~ agResponse:", agResponse);

  return {
    statusCode: 200,
  };
};

module.exports.handler = async (event) => {
  console.log(" ~ module.exports.handler= ~ event:", event);
  const domain = event.requestContext.domainName;
  const stage = event.requestContext.stage;
  const connectionId = event.requestContext.connectionId;
  const callbackUrlForAWS = `https://${domain}/${stage}`; // Ensure wss:// for WebSockets

  switch (
    event.requestContext.routeKey // Use event.routeKey for route identification
  ) {
    case "$connect":
      console.log("Connect");

      return {
        statusCode: 200,
      };
    case "$disconnect":
      console.log("Disconnect");
      // Handle disconnection gracefully, e.g., remove connectionId from tracking
      return {
        statusCode: 200, // Close the connection gracefully
      };

    case "$default": {
      console.log("Unknown route", event.requestContext.routeKey);

      const body: {
        reqType: "getConnectionIds" | "sendMessage" | "disconnect";
        message: string;
        to: string;
      } = JSON.parse(event.body);

      switch (body.reqType) {
        case "getConnectionIds": {
          // add the connectionId to the DynamoDB table
          const dbResponse = await addNewConnectionCommand(connectionId);
          console.log("🚀  ~ dbResponse:", dbResponse);

          // get all the connections from the DynamoDB table
          const activeConnectionId = (
            await getAllActiveConnectionCommand()
          )?.Items?.map((item) => {
            return {
              socketId: item.cId,
              clientName: item?.clientName ?? item.cId,
            };
          });

          console.log(
            "🚀 ~ module.exports.handler= ~ activeConnectionId:",
            activeConnectionId
          );

          const response = {
            reqType: "getConnectionIds",
            connectionId,
            activeConnectionId,
          };

          // send the response to the client
          return sendToOne(callbackUrlForAWS, connectionId, response);
        }
        case "sendMessage": {
          const response = {
            reqType: "sendMessage",
            from: connectionId,
            message: body.message,
          };
          return sendToOne(callbackUrlForAWS, body.to, response);
        }
        case "disconnect": {
          await deleteConnection(callbackUrlForAWS, connectionId);
          return {
            statusCode: 200,
          };
        }
        default:
          return {
            statusCode: 400,
            body: "Unknown reqType",
          };
      }
    }
  }

  return {
    statusCode: 200,
  };
};
