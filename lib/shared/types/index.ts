import type { StackProps } from "aws-cdk-lib";

export type RecipeType = {
  recipeId: string;
  name: string;
  author: string;
  createdAt: Date;
  modifiedAt: Date;
  category: string;
  ingredients: string[];
  method: string;
  cookTime?: string;
  prepTime?: string;
  addTIme?: string;
  yield?: string;
  servings?: number;
};

export type EnvConfigType = {
  AWS_ACCOUNT: string;
  AWS_REGION: string;
  AWS_TABLE_NAME: string;
  AWS_BUCKET_NAME: string;
};

export interface AwsEnvStackProps extends StackProps {
  config: Readonly<EnvConfigType>;
}
