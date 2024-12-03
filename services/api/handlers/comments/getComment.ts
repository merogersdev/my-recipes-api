import { apiResponse } from "../../utils/response";
import { logger } from "../../utils/logger";
import { getItem } from "../../utils/db";

import type { Handler } from "aws-lambda";

const table: string = process.env.AWS_DYNAMODB_TABLE!;

export const handler: Handler = async (event, _context) => {
  const {
    recipeId,
    username,
    commentId,
  }: { recipeId: string; username: string; commentId: string } =
    event.pathParameters;

  if (!recipeId || !username || !commentId)
    return apiResponse(400, "Error: Invalid ID or username", null);

  const requestedItem = {
    PK: `COMMENT#${recipeId}`,
    SK: `COMMENT#${commentId}`,
  };

  try {
    const result = await getItem(requestedItem, table);
    if (!result) return apiResponse(404, "Error: Comment not found", null);
    return apiResponse(200, "Success: Comment retrieved", result.Item);
  } catch (error) {
    logger.error(error);
    return apiResponse(500, "Error: Comment not retrieved", error);
  }
};
