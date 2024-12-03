import { ulid } from "ulid";

import { apiResponse } from "../../utils/response";
import { logger } from "../../utils/logger";
import { Like } from "../../../../schemas/like";
import { createWriteTransaction } from "../../utils/db";

import type { Handler } from "aws-lambda";

const table: string = process.env.AWS_DYNAMODB_TABLE!;
const id: string = ulid();

export const handler: Handler = async (event, _context) => {
  const body = JSON.parse(event.body || {});

  const newItem = {
    PK: `LIKE#${body.recipeId}`,
    SK: `LIKE#${body.userName}`,
    GSI1PK: `RECIPE#${body.recipeId}`,
    GSI1SK: `LIKE#${id}`,
    likeId: id,
    ...body,
  };

  try {
    Like.parse(newItem);
    const result = await createWriteTransaction(table, newItem, body.recipeId);
    return apiResponse(201, "Success: Like created", result);
  } catch (error) {
    logger.error(error);
    return apiResponse(500, "Error: Cannot create like", error);
  }
};
