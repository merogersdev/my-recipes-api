import { marshall } from "@aws-sdk/util-dynamodb";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

import { dbClient } from "../../../config/db";
import { logger } from "../../../shared/logger";

import type { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const recipeObjKeys = Object.keys(body);
    const params = {
      TableName: process.env.AWS_DYNAMODB_TABLE,
      Key: marshall({ id: event.pathParameters.id }),
      UpdateExpression: `SET ${recipeObjKeys
        .map((_, index) => `#key${index} = :value${index}`)
        .join(", ")}`,
      ExpressionAttributeNames: recipeObjKeys.reduce(
        (acc, key, index) => ({
          ...acc,
          [`#key${index}`]: key,
        }),
        {}
      ),
      ExpressionAttributeValues: marshall(
        recipeObjKeys.reduce(
          (acc, key, index) => ({
            ...acc,
            [`:value${index}`]: body[key],
          }),
          {}
        )
      ),
    };

    const result = await dbClient.send(new UpdateCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Recipe created successfully",
        result,
      }),
    };
  } catch (error) {
    logger.error("Error:", error);
    return {
      statusCode: 500,
      body: "Server Error",
    };
  }
};
