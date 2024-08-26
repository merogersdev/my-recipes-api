import { DeleteItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

import { dbClient } from "../../lib/config/db";
import { logger } from "../../lib/shared/logger";

import type { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
  const table = process.env.DYNAMODB_TABLE_NAME;
  try {
    const params = {
      TableName: table,
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
