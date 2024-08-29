import { APIGatewayEvent } from "aws-lambda";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { GetItemCommand } from "@aws-sdk/client-dynamodb";

import { dbClient } from "../../../config/db";
import { logger } from "../../../shared/logger";

import type { Handler } from "aws-lambda";

export const handler: Handler = async (event) => {
  try {
    const params = {
      TableName: process.env.AWS_DYNAMODB_TABLE,
      Key: marshall({ id: event.pathParameters.id }),
    };

    const { Item } = await dbClient.send(new GetItemCommand(params));

    if (Item === null) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "Recipe not found",
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Successfully retrieved item",
        // TODO: Double check this
        data: Item && unmarshall(Item),
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
