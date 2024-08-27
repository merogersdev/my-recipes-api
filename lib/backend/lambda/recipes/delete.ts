import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

import { dbClient } from "../../../config/db";
import { logger } from "../../../shared/logger";

import type { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
  try {
    const params = {
      TableName: process.env.AWS_TABLE_NAME,
      Key: marshall({ id: event.pathParameters.id }),
    };

    const result = await dbClient.send(new DeleteItemCommand(params));

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Recipe deleted successfully",
        result,
      }),
    };
  } catch (error) {
    logger.error("Server Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server Error" }),
    };
  }
};
