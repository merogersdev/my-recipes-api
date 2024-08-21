import * as dotenv from "dotenv";
import path = require("path");

import type { ConfigProps } from "../types";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export const getConfig = (): ConfigProps => ({
  REGION: process.env.REGION || "",
  LAMBDA_ENV: process.env.LAMBDA || "",
  TABLE_NAME: process.env.TABLE_NAME || "",
});
