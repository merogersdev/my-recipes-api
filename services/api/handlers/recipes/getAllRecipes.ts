import { apiResponse } from "../../utils/response";
import { getAllItemsQuery } from "../../utils/db";

import type { Handler } from "aws-lambda";

const table: string = process.env.AWS_DYNAMODB_TABLE!;

export const handler: Handler = async (event, _context) => {
  const { username } = event.pathParameters;
  try {
    const result = await getAllItemsQuery(table, username, "RECIPE#");
    return apiResponse(200, "Success: Items retrieved", result);
  } catch (error) {
    return apiResponse(500, "Error: Cannot retrieve items", error);
  }
};
