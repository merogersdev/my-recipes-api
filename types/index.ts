import type { StackProps } from "aws-cdk-lib";

export interface RecipeInterface {
  id: string;
  name: string;
  author: string;
  createdAt: string;
  modifiedAt: string;
  category: string;
  ingredients: string[];
  method: string;
  cookTime?: string;
  prepTime?: string;
  addTime?: string;
  yield?: string;
  servings?: number;
}

export interface ConfigProps {
  REGION: string;
  LAMBDA_ENV: string;
  TABLE_NAME: string;
}

export interface AwsEnvStackProps extends StackProps {
  config: Readonly<ConfigProps>;
}
