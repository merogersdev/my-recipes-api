import { apiResponse } from "../../../../utils/response";
import { logger } from "../../../../utils/logger";
import { getItem } from "../../../../utils/db";

import type { Handler } from "aws-lambda";

const table: string = process.env.AWS_DYNAMODB_TABLE!;

export const handler: Handler = async (event, _context) => {
  const { id, username } = event.pathParameters;

  if (!id || !username)
    return apiResponse(400, "Error: Invalid ID or username", null);

  const requestedItem = {
    PK: `USER#${username}`,
    SK: `RECIPE#${id}`,
  };

  try {
    const result = await getItem(requestedItem, table);
    if (!result) return apiResponse(404, "Error: Item not found", null);
    return apiResponse(200, "Success: Item retrieved", result.Item);
  } catch (error) {
    logger.error(error);
    return apiResponse(500, "Error: Item not retrieved", error);
  }
};
