import { apiResponse } from "../../utils/response";
import { updateItem } from "../../utils/db";

import type { Handler } from "aws-lambda";

const table: string = process.env.AWS_DYNAMODB_TABLE!;

export const handler: Handler = async (event) => {
  const { username } = event.pathParameters;

  if (!username) return apiResponse(400, "Error: Invalid username", null);

  const item = {
    PK: `USER#${username}`,
    SK: `USER#${username}`,
  };

  try {
    const result = await updateItem(item, event.body, table);
    if (!result) return apiResponse(404, "Error: User not found", null);
    return apiResponse(200, "Success: Item updated", result);
  } catch (error) {
    console.error(error);
    return apiResponse(500, "Error: Item update failed", error);
  }
};
