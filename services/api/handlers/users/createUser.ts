import { apiResponse } from "../../../../utils/response";
import { logger } from "../../../../utils/logger";
import { User } from "../../../../schemas/user";
import { createItem } from "../../../../utils/db";

import type { Handler } from "aws-lambda";

const table: string = process.env.AWS_DYNAMODB_TABLE!;
const now: string = new Date().toISOString();

export const handler: Handler = async (event, _context) => {
  const { username } = event.pathParameters;
  const body = JSON.parse(event.body || {});

  const newItem = {
    PK: `USER#${username}`,
    SK: `USER#${username}`,
    createdAt: now,
    ...body,
  };

  try {
    User.parse(newItem);
    await createItem(newItem, table);
    return apiResponse(201, "Success: User created", newItem);
  } catch (error) {
    logger.error(error);
    return apiResponse(500, "Error: Cannot create user", error);
  }
};
