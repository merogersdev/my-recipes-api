import { apiResponse } from "../../../../utils/response";
import { getAllItems } from "../../../../utils/db";

import type { Handler } from "aws-lambda";

const table: string = process.env.AWS_DYNAMODB_TABLE!;

export const handler: Handler = async (_event, _context) => {
  try {
    const result = await getAllItems(table);
    return apiResponse(200, "Success: Items retrieved", result);
  } catch (error) {
    return apiResponse(500, "Error: Cannot retrieve items", error);
  }
};
