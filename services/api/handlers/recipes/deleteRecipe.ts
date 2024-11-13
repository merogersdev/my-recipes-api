import { DynamoDBDocumentClient, DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromEnv } from "@aws-sdk/credential-provider-env";

import { apiResponse } from "../../../../utils/response";

import type { Handler } from "aws-lambda";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
});

const docClient = DynamoDBDocumentClient.from(client);

export const handler: Handler = async (event, _context) => {
  const { id, username } = event.pathParameters;
  const table = process.env.AWS_DYNAMODB_TABLE;

  if (!id || !username) return apiResponse(400, "Error: invalid ID", null);

  const item = {
    PK: `USER#${username}`,
    SK: `RECIPE#${id}`,
  };

  try {
    const deleteRecipe = new DeleteCommand({
      TableName: table,
      Key: item,
    });

    await docClient.send(deleteRecipe);
    return apiResponse(200, "Success: Deleted item", item);
  } catch (error) {
    console.error(error);
    return apiResponse(500, "Error: Could not delete item", error);
  }
};
