import { PutItemCommand } from "@aws-sdk/client-dynamodb";
import { marshall } from "@aws-sdk/util-dynamodb";

import { dbClient } from "../../../config/db";
import { logger } from "../../../shared/logger";

import type { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const params = {
      TableName: process.env.AWS_DYNAMODB_TABLE,
      Item: marshall(body),
    };

    const result = await dbClient.send(new PutItemCommand(params));

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Recipe created successfully",
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
