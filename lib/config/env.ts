import * as dotenv from "dotenv";
dotenv.config();

import type { EnvConfigType } from "../shared/types";

export const getEnvConfig = (): EnvConfigType => ({
  AWS_ACCOUNT: process.env.AWS_ACCOUNT || "",
  AWS_REGION: process.env.AWS_REGION || "",
  LAMBDA_ENV: process.env.LAMBDA_ENV || "",
  DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME || "",
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || "",
});
