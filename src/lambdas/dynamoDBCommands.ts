import { DynamoDBClient } from "@aws-sdk/client-dynamodb"; // ES Modules import
import {
  DynamoDBDocumentClient,
  PutCommand,
  PutCommandInput,
  QueryCommand,
  QueryCommandInput,
} from "@aws-sdk/lib-dynamodb";

const dynamoDBClient = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(dynamoDBClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});

const addNewConnectionCommand = async (connectionId: string) => {
  const input: PutCommandInput = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      actionType: "activeConnection",
      cId: connectionId,
    },
  };
  const command = new PutCommand(input);
  return await docClient.send(command);
};

const getAllActiveConnectionCommand = async () => {
  const input: QueryCommandInput = {
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditionExpression: "actionType = :actionType",
    ExpressionAttributeValues: {
      ":actionType": "activeConnection",
    },
  };
  const command = new QueryCommand(input);
  console.log("🚀 ~ getAllActiveConnectionCommand ~ command:", command);
  return await docClient.send(command);
};

export { addNewConnectionCommand, getAllActiveConnectionCommand };
