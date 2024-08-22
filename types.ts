import { z } from "zod";
import type { StackProps } from "aws-cdk-lib";

export const Recipe = z.object({
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

export const Config = z.object({
  ACCOUNT: z.string(),
  REGION: z.string(),
  LAMBDA_ENV: z.string(),
  TABLE_NAME: z.string(),
});

export type RecipeType = z.infer<typeof Recipe>;
export type ConfigType = z.infer<typeof Config>;

export interface AwsEnvStackProps extends StackProps {
  config: Readonly<ConfigType>;
}

// export interface RecipeInterface {
//   id: string;
//   name: string;
//   author: string;
//   createdAt: string;
//   modifiedAt: string;
//   category: string;
//   ingredients: string[];
//   method: string;
//   cookTime?: string;
//   prepTime?: string;
//   addTime?: string;
//   yield?: string;
//   servings?: number;
// }

// export interface ConfigProps {
//   ACCOUNT: string;
//   REGION: string;
//   LAMBDA_ENV: string;
//   TABLE_NAME: string;
// }

// export interface AwsEnvStackProps extends StackProps {
//   config: Readonly<ConfigProps>;
// }
