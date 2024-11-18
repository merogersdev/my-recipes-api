import { GetCommand } from "@aws-sdk/lib-dynamodb";

import { apiResponse } from "../../../../utils/response";
import { logger } from "../../../../utils/logger";
import { docClient } from "../../../../config/db";
import { getItem } from "../../../../utils/db";

import type { Handler } from "aws-lambda";

export const handler: Handler = async (event, _context) => {
  const { id, username } = event.pathParameters;
  const table = process.env.AWS_DYNAMODB_TABLE;

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
