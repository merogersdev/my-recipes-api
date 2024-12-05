import { apiResponse } from "../../utils/response";
import { updateItem } from "../../utils/db";

import type { Handler } from "aws-lambda";

const table: string = process.env.AWS_DYNAMODB_TABLE!;

export const handler: Handler = async (event) => {
  const { recipeId, username }: { recipeId: string; username: string } =
    event.pathParameters;

  if (!recipeId || !username || !event.body)
    return apiResponse(400, "Error: Invalid request", null);

  const item = {
    PK: `USER#${username}`,
    SK: `RECIPE#${recipeId}`,
  };

  try {
    const result = await updateItem(item, event.body, table);
    if (!result) return apiResponse(404, "Error: Recipe not found", null);
    return apiResponse(200, "Success: Item updated", result);
  } catch (error) {
    console.error(error);
    return apiResponse(500, "Error: Item update failed", error);
  }
};
