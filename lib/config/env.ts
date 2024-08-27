import * as dotenv from "dotenv";
dotenv.config();

import type { EnvConfigType } from "../shared/types";

export const getEnvConfig = (): EnvConfigType => ({
  AWS_ACCOUNT: process.env.CDK_DEFAULT_ACCOUNT || "",
  AWS_REGION: process.env.CDK_DEFAULT_REGION || "",
  AWS_TABLE_NAME: process.env.AWS_TABLE_NAME || "",
  AWS_BUCKET_NAME: process.env.AWS_BUCKET_NAME || "",
});
