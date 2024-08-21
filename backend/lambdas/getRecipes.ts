import { APIGatewayEvent } from "aws-lambda";
import { DynamoDB } from "@aws-sdk/client-dynamodb";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";

const dynamodb = new DynamoDB();

export const handler = async (_event: APIGatewayEvent) => {
  try {
    const result = await dynamodb.send(
      new ScanCommand({
        TableName: process.env.TABLE_NAME,
      })
    );

    return {
      statusCode: 200,
      body: JSON.stringify(result.Items),
    };
  } catch (error) {
    console.error("Server Error:", error);
    return {
      statusCode: 500,
      body: "Server Error",
    };
  }
};
