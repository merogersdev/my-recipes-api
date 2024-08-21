import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { randomUUID } from "crypto";

import { RecipeInterface } from "../../types";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

const dynamodb = new DynamoDB();

export const handler = async (body: string | null) => {
  try {
    const uuid = randomUUID();

    if (body === null) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing Recipe" }),
      };
    }

    const bodyParsed = JSON.parse(body) as RecipeInterface;

    await dynamodb.send(
      new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
          pk: uuid,
          ...bodyParsed,
        },
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Recipe Created" }),
    };
  } catch (error) {
    console.error("Server Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server Error" }),
    };
  }
};
