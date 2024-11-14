import { z } from "zod";

const EnvConfig = z.object({
  AWS_ACCOUNT: z.string(),
  AWS_REGION: z.string(),
  AWS_S3_BUCKET: z.string(),
  AWS_DYNAMODB_TABLE: z.string(),
});

export type EnvConfigType = z.infer<typeof EnvConfig>;
