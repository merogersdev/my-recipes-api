import { z } from "zod";
import * as dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  CDK_DEFAULT_ACCOUNT: z.string(),
  CDK_DEFAULT_REGION: z.string(),
  AWS_S3_BUCKET: z.string(),
  AWS_DYNAMODB_TABLE: z.string(),
  ENV: z.union([z.literal("dev"), z.literal("prod")]).default("dev"),
});

export type envType = z.infer<typeof envSchema>;

export const env: envType = envSchema.parse(process.env);
