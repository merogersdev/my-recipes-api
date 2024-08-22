import "dotenv/config.js";

import type { ConfigType } from "./types";

export const getConfig = (): ConfigType => ({
  ACCOUNT: process.env.ACCOUNT || "",
  REGION: process.env.REGION || "",
  LAMBDA_ENV: process.env.LAMBDA_ENV || "",
  TABLE_NAME: process.env.TABLE_NAME || "",
});
