import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

import { docClient } from "../../../../config/db";
import { apiResponse } from "../../../../utils/response";

import type { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
  const { id, username } = event.pathParameters;
  const table = process.env.AWS_DYNAMODB_TABLE;

  if (!id || !username)
    return apiResponse(400, "Error: Invalid request ID", null);

  const body = JSON.parse(event.body);
  const itemKeys = Object.keys(body);

  const item = {
    PK: `USER#${username}`,
    SK: `RECIPE#${id}`,
  };

  try {
    const updateRecipe = new UpdateCommand({
      TableName: table,
      Key: item,
      UpdateExpression: `SET ${itemKeys
        .map((_k, index) => `#field${index} = :value${index}`)
        .join(", ")}`,
      ExpressionAttributeNames: itemKeys.reduce(
        (accumulator, k, index) => ({
          ...accumulator,
          [`#field${index}`]: k,
        }),
        {}
      ),
      ExpressionAttributeValues: itemKeys.reduce(
        (accumulator, k, index) => ({
          ...accumulator,
          [`:value${index}`]: body[k],
        }),
        {}
      ),
      ReturnValues: "ALL_NEW",
    });

    await docClient.send(updateRecipe);

    return apiResponse(200, "Success: Item updated", updateRecipe.input);
  } catch (error) {
    console.error(error);
    return apiResponse(500, "Error: Item update failed", error);
  }
};
