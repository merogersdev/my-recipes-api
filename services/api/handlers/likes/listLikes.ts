import { apiResponse } from "../../utils/response";
import { logger } from "../../utils/logger";
import { listItemsQuery } from "../../utils/db";

import type { Handler } from "aws-lambda";

const table: string = process.env.AWS_DYNAMODB_TABLE!;

export const handler: Handler = async (event, _context) => {
  const { id }: { id: string } = event.pathParameters;

  try {
    const results = await listItemsQuery(table, id);

    return apiResponse(200, "Success: Likes retrieved", results);
  } catch (error) {
    logger.error(error);
    return apiResponse(500, "Error: Cannot create like", error);
  }
};
