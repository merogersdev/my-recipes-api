import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";

import { apiResponse } from "../../../../utils/response";
import { docClient } from "../../../../config/db";

export const handler: APIGatewayProxyHandlerV2 = async (_event, _context) => {
  try {
    const command = new ScanCommand({
      TableName: process.env.AWS_DYNAMODB_TABLE,
    });

    const res = await docClient.send(command);
    return apiResponse(200, "Success: Items retrieved", res.Items);
  } catch (error) {
    return apiResponse(500, "Error: Cannot retrieve items", error);
  }
};
