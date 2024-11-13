import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromEnv } from "@aws-sdk/credential-provider-env";
import { apiResponse } from "../../../../utils/response";

import { logger } from "../../../../utils/logger";

import type { Handler } from "aws-lambda";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
});

const docClient = DynamoDBDocumentClient.from(client);

export const handler: Handler = async (event, _context) => {
  const { id, username } = event.pathParameters;
  const table = process.env.AWS_DYNAMODB_TABLE;

  if (!id || !username)
    return apiResponse(400, "Error: Invalid ID or username", null);

  const item = {
    PK: `USER#${username}`,
    SK: `RECIPE#${id}`,
  };

  try {
    const getSingleRecipe = new GetCommand({
      TableName: table,
      Key: item,
    });

    const data = await docClient.send(getSingleRecipe);

    if (!data.Item) return apiResponse(404, "Error: Item not found", null);

    return apiResponse(200, "Success: Item retrieved", data.Item);
  } catch (error) {
    logger.error(error);
    return apiResponse(500, "Error: Item not retrieved", error);
  }
};
