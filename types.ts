import { z } from "zod";
import type { StackProps } from "aws-cdk-lib";

export const RecipeSchema = z.object({
  id: z.string(),
  name: z.string(),
  author: z.string(),
  createdAt: z.date(),
  modifiedAt: z.date(),
  category: z.string(),
  ingredients: z.array(z.string()),
  method: z.string(),
  cookTime: z.string().optional(),
  prepTime: z.string().optional(),
  addTIme: z.string().optional(),
  yield: z.string().optional(),
  servings: z.number().optional(),
});

export const ConfigSchema = z.object({
  ACCOUNT: z.string(),
  REGION: z.string(),
  LAMBDA_ENV: z.string(),
  TABLE_NAME: z.string(),
  BUCKET_NAME: z.string(),
});

export type RecipeType = z.infer<typeof RecipeSchema>;
export type ConfigType = z.infer<typeof ConfigSchema>;

export interface AwsEnvStackProps extends StackProps {
  config: Readonly<ConfigType>;
}
