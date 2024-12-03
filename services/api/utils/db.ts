import {
  UpdateCommand,
  GetCommand,
  PutCommand,
  DeleteCommand,
  ScanCommand,
  QueryCommand,
  TransactWriteCommand,
} from "@aws-sdk/lib-dynamodb";

import { getClient } from "../../../config/db";

// Return single item from DynamoDB Table
export const getItem = async (item: object, table: string | undefined) => {
  const client = getClient();

  if (!item || !table) throw new Error("Missing values for get item function");

  const getSingleitem = new GetCommand({
    TableName: table,
    Key: item,
  });

  return await client.send(getSingleitem);
};

// Create item in DynamoDB Table
export const createItem = async (item: object, table: string | undefined) => {
  const client = getClient();
  if (!item || !table)
    throw new Error("Missing values for create item function");

  const createItem = new PutCommand({
    TableName: table,
    Item: item,
    ConditionExpression:
      "attribute_not_exists(PK) and attribute_not_exists(SK)",
  });

  return await client.send(createItem);
};

// Delete item in DynamoDB Table
export const deleteItem = async (item: object, table: string | undefined) => {
  const client = getClient();
  if (!item || !table)
    throw new Error("Missing values for delete item function");

  const deleteItem = new DeleteCommand({
    TableName: table,
    Key: item,
  });

  return await client.send(deleteItem);
};

// Update item in DynamoDB Table, updating every value passed
export const updateItem = async (
  item: object,
  input: string,
  table: string | undefined
) => {
  const client = getClient();
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

  return await client.send(updateItem);
};

// Return single item from DynamoDB Table
export const getAllItems = async (table: string) => {
  const client = getClient();
  if (!table) throw new Error("Missing values for get item function");

  const getItems = new ScanCommand({
    TableName: process.env.AWS_DYNAMODB_TABLE,
  });

  return await client.send(getItems);
};

// Queries by PK and record type
export const getAllItemsQuery = async (
  table: string,
  pk: string,
  beginsWith: string
) => {
  const client = getClient();
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

  return await client.send(getItems);
};

export const listItemsQuery = async (table: string, id: string) => {
  const client = getClient();
  if (!table || !id) throw new Error("Missing values for lists items function");

  const listItems = new QueryCommand({
    TableName: table,
    KeyConditionExpression: "GSI1PK = :gsi1pk",
    ExpressionAttributeValues: {
      ":gsi1pk": id,
    },
    ScanIndexForward: false,
  });

  return await client.send(listItems);
};

// Create DB write transaction, updating
export const createWriteTransaction = async (
  table: string,
  item: object,
  id: string,
  count: "likeCount" | "commentCount"
) => {
  const client = getClient();

  if (!table || !item || !id)
    throw new Error("Missing values for create write transaction function");

  const command = new TransactWriteCommand({
    TransactItems: [
      {
        Put: {
          TableName: table,
          Item: item,
          ConditionExpression: "attribute_exists(PK)",
        },
      },
      {
        Update: {
          TableName: table,
          Key: { recipeId: id },
          ConditionExpression: "attribute_not_Exists(PK)",
          UpdateExpression: `SET ${count} = ${count} + :increment`,
          ExpressionAttributeValues: { ":increment": 1 },
        },
      },
    ],
  });

  return await client.send(command);
};
