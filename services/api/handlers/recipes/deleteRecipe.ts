import { apiResponse } from "../../utils/response";
import { deleteItem } from "../../utils/db";
import { logger } from "../../utils/logger";

import type { Handler } from "aws-lambda";

const table: string = process.env.AWS_DYNAMODB_TABLE!;

export const handler: Handler = async (event, _context) => {
  const { id, username } = event.pathParameters;

  if (!id || !username) return apiResponse(400, "Error: invalid ID", null);

  const item = {
    PK: `USER#${username}`,
    SK: `RECIPE#${id}`,
  };

  try {
    const result = await deleteItem(item, table);
    if (!result) return apiResponse(404, "Error: Recipe not found", null);
    return apiResponse(200, "Success: Deleted item", item);
  } catch (error) {
    logger.error(error);
    return apiResponse(500, "Error: Could not delete item", error);
  }
};
