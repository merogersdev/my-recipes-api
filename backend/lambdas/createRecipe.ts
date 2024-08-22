import { DynamoDB } from "@aws-sdk/client-dynamodb";

import { RecipeSchema } from "../../types";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import type { Handler } from "aws-lambda";
import { logger } from "../../logger";

const dynamodb = new DynamoDB();

export const handler: Handler = async (event) => {
  try {
    if (event.body === null) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing Recipe" }),
      };
    }

    const recipe = RecipeSchema.parse(event.body);

    await dynamodb.send(
      new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
          ...recipe,
        },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Recipe Created" }),
    };
  } catch (error) {
    logger.error("Server Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server Error" }),
    };
  }
};
