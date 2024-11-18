import { randomUUID } from "crypto";

import { apiResponse } from "../../../../utils/response";
import { logger } from "../../../../utils/logger";
import { Recipe } from "../../../../schemas/recipe";
import { createItem } from "../../../../utils/db";

import type { Handler } from "aws-lambda";

const uuid = randomUUID();
const table: string = process.env.AWS_DYNAMODB_TABLE!;
const now: string = new Date().toISOString();

export const handler: Handler = async (event, _context) => {
  const body = JSON.parse(event.body || {});

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
    await createItem(newItem, table);
    return apiResponse(201, "Success: Item Created", newItem);
  } catch (error) {
    logger.error(error);
    return apiResponse(500, "Error: Cannot create item", error);
  }
};
