import { apiResponse } from "../../utils/response";
import { logger } from "../../utils/logger";
import { getItem } from "../../utils/db";

import type { Handler } from "aws-lambda";

const table: string = process.env.AWS_DYNAMODB_TABLE!;

export const handler: Handler = async (event, _context) => {
  const { username } = event.pathParameters;

  if (!username) return apiResponse(400, "Error: Missing username", null);

  const requestedItem = {
    PK: `USER#${username}`,
    SK: `USER#${username}`,
  };

  try {
    const result = await getItem(requestedItem, table);
    if (!result) return apiResponse(404, "Error: User not found", null);
    return apiResponse(200, "Success: User retrieved", result.Item);
  } catch (error) {
    logger.error(error);
    return apiResponse(500, "Error: User not retrieved", error);
  }
};
