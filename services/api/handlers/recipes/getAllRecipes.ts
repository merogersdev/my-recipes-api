import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";

import { apiResponse } from "../../../../utils/response";

import { getAllItems } from "../../../../utils/db";

export const handler: APIGatewayProxyHandlerV2 = async (_event, _context) => {
  const table = process.env.AWS_DYNAMODB_TABLE || "";
  try {
    const result = await getAllItems(table);
    return apiResponse(200, "Success: Items retrieved", result);
  } catch (error) {
    return apiResponse(500, "Error: Cannot retrieve items", error);
  }
};
