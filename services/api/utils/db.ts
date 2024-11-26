import {
  UpdateCommand,
  GetCommand,
  PutCommand,
  DeleteCommand,
  ScanCommand,
  QueryCommand,
} from "@aws-sdk/lib-dynamodb";

import { docClient } from "../../../config/db";

// Return single item from DynamoDB Table
export const getItem = async (item: object, table: string | undefined) => {
  if (!item || !table) throw new Error("Missing values for get item function");

  const getSingleitem = new GetCommand({
    TableName: table,
    Key: item,
  });

  return await docClient.send(getSingleitem);
};

// Create item in DynamoDB Table
export const createItem = async (item: object, table: string | undefined) => {
  if (!item || !table)
    throw new Error("Missing values for create item function");

  const createItem = new PutCommand({
    TableName: table,
    Item: item,
    ConditionExpression: "attribute_not_exists(PK)",
  });

  return await docClient.send(createItem);
};

// Delete item in DynamoDB Table
export const deleteItem = async (item: object, table: string | undefined) => {
  if (!item || !table)
    throw new Error("Missing values for delete item function");

  const deleteItem = new DeleteCommand({
    TableName: table,
    Key: item,
  });

  return await docClient.send(deleteItem);
};

// Update item in DynamoDB Table, updating every value passed
export const updateItem = async (
  item: object,
  input: string,
  table: string | undefined
) => {
  if (!item || !input || !table)
    throw new Error("Missing values for Get Item function");

  const body = JSON.parse(input);
  const itemKeys = Object.keys(body);

  const updateItem = new UpdateCommand({
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

  return await docClient.send(updateItem);
};

// Return single item from DynamoDB Table
export const getAllItems = async (table: string) => {
  if (!table) throw new Error("Missing values for get item function");

  const getItems = new ScanCommand({
    TableName: process.env.AWS_DYNAMODB_TABLE,
  });

  return await docClient.send(getItems);
};

// Queries by PK and record type
export const getAllItemsQuery = async (
  table: string,
  pk: string,
  beginsWith: string
) => {
  if (!table || !pk || !beginsWith)
    throw new Error("Missing values for get item function");

  const getItems = new QueryCommand({
    TableName: process.env.AWS_DYNAMODB_TABLE,

    KeyConditionExpression: "#PK = :PK and begins_with(#SK,:SK)",
    ExpressionAttributeNames: {
      "#PK": "PK",
      "#SK": "SK",
    },
    ExpressionAttributeValues: {
      ":PK": pk.toString(),
      ":SK": beginsWith.toString(),
    },
  });

  return await docClient.send(getItems);
};
