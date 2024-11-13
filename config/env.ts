import * as dotenv from "dotenv";

import type { EnvConfigType } from "../types";

dotenv.config();

export const getEnvConfig = (): EnvConfigType => ({
  AWS_ACCOUNT: process.env.CDK_DEFAULT_ACCOUNT || "",
  AWS_REGION: process.env.CDK_DEFAULT_REGION || "",
  AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || "",
  AWS_DYNAMODB_TABLE: process.env.AWS_DYNAMODB_TABLE || "",
});
