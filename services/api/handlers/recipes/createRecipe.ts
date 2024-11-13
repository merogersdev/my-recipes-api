import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { randomUUID } from "crypto";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { fromEnv } from "@aws-sdk/credential-provider-env";
import { apiResponse } from "../../../../utils/response";

import { logger } from "../../../../utils/logger";
import { Recipe } from "../../../../schemas/recipe";

import type { Handler } from "aws-lambda";

const client = new DynamoDBClient({
  region: process.env.AWS_REGION,
  credentials: fromEnv(),
});

const docClient = DynamoDBDocumentClient.from(client);

export const handler: Handler = async (event, _context) => {
  const uuid = randomUUID();
  const table = process.env.AWS_DYNAMODB_TABLE;
  const body = JSON.parse(event.body || {});
  const now: string = new Date().toISOString();

  const newItem = {
    PK: `USER#${body.username}`,
    SK: `RECIPE#${uuid}`,
    createdAt: now,
    recipeId: uuid,
    likes: 0,
    ...body,
  };

  try {
    Recipe.parse(newItem);

    const createRecipe = new PutCommand({
      TableName: table,
      Item: newItem,
      ConditionExpression: "attribute_not_exists(PK)",
    });

    await docClient.send(createRecipe);
    return apiResponse(201, "Success: Item Created", newItem);
  } catch (error) {
    logger.error(error);
    return apiResponse(500, "Error: Cannot create item", error);
  }
};
