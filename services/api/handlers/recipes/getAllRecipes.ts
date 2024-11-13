import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { fromEnv } from "@aws-sdk/credential-provider-env";
import { apiResponse } from "../../../../utils/response";

import type { APIGatewayProxyHandlerV2 } from "aws-lambda";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
});

const docClient = DynamoDBDocumentClient.from(client);

export const handler: APIGatewayProxyHandlerV2 = async (_event, _context) => {
  try {
    const command = new ScanCommand({
      TableName: process.env.AWS_DYNAMODB_TABLE,
    });

    const res = await docClient.send(command);
    return apiResponse(200, "Success: Items retrieved", res.Items);
  } catch (error) {
    return apiResponse(500, "Error: Cannot retrieve items", error);
  }
};
