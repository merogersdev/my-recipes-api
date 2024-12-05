import { apiResponse } from "../../utils/response";
import { logger } from "../../utils/logger";
import { getAllItemsQuery } from "../../utils/db";

import type { Handler } from "aws-lambda";

const table: string = process.env.AWS_DYNAMODB_TABLE!;

export const handler: Handler = async (event, _context) => {
  const { recipeId }: { recipeId: string } = event.pathParameters;

  try {
    const results = await getAllItemsQuery(table, recipeId, "#LIKE");

    return apiResponse(200, "Success: Likes retrieved", results);
  } catch (error) {
    logger.error(error);
    return apiResponse(500, "Error: Cannot retrieve likes", error);
  }
};
