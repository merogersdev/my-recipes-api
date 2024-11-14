import { DeleteCommand } from "@aws-sdk/lib-dynamodb";

import { apiResponse } from "../../../../utils/response";
import { docClient } from "../../../../config/db";

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
    const deleteRecipe = new DeleteCommand({
      TableName: table,
      Key: item,
    });

    await docClient.send(deleteRecipe);
    return apiResponse(200, "Success: Deleted item", item);
  } catch (error) {
    console.error(error);
    return apiResponse(500, "Error: Could not delete item", error);
  }
};
