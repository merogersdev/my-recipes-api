import { apiResponse } from "../../utils/response";
import { updateItem } from "../../utils/db";

import type { Handler } from "aws-lambda";

const table: string = process.env.AWS_DYNAMODB_TABLE!;

export const handler: Handler = async (event) => {
  const {
    recipeId,
    username,
    commentId,
  }: { recipeId: string; username: string; commentId: string } =
    event.pathParameters;

  if (!recipeId || !username || !event.body || !commentId)
    return apiResponse(400, "Error: Invalid request", null);

  const item = {
    PK: `COMMENT#${recipeId}`,
    SK: `COMMENT#${commentId}`,
  };

  try {
    const result = await updateItem(item, event.body, table);
    if (!result) return apiResponse(404, "Error: Comment not found", null);
    return apiResponse(200, "Success: Comment updated", result);
  } catch (error) {
    console.error(error);
    return apiResponse(500, "Error: Comment update failed", error);
  }
};
