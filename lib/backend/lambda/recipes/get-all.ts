import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from "@aws-sdk/util-dynamodb";

import { dbClient } from "../../../config/db";
import { logger } from "../../../shared/logger";

import type { Handler } from "aws-lambda";

export const handler: Handler = async (_event) => {
  const table = process.env.DYNAMODB_TABLE_NAME;
  try {
    const { Items } = await dbClient.send(
      new ScanCommand({
        TableName: table,
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Successfully retrieved recipes",
        data: Items?.map((item) => unmarshall(item)),
        Items,
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
