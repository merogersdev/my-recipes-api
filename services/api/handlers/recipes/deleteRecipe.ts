import { apiResponse } from "../../../../utils/response";
import { deleteItem } from "../../../../utils/db";
import { logger } from "../../../../utils/logger";

import type { Handler } from "aws-lambda";

export const handler: Handler = async (event, _context) => {
  const { id, username } = event.pathParameters;
  const table = process.env.AWS_DYNAMODB_TABLE;

  if (!id || !username) return apiResponse(400, "Error: invalid ID", null);

  const item = {
    PK: `USER#${username}`,
    SK: `RECIPE#${id}`,
  };

  try {
    await deleteItem(item, table);
    return apiResponse(200, "Success: Deleted item", item);
  } catch (error) {
    logger.error(error);
    return apiResponse(500, "Error: Could not delete item", error);
  }
};
