import type { StackProps } from "aws-cdk-lib";

export type RecipeType = {
  name: string;
  author: string;
  createdOn: Date;
  category: string;
  ingredients: string[];
  method: string;
  cookTime?: string;
  prepTime?: string;
  yield?: string;
  servings?: number;
};

export type EnvConfigType = {
  AWS_ACCOUNT: string;
  AWS_REGION: string;
  AWS_S3_BUCKET: string;
  AWS_DYNAMODB_TABLE: string;
};

export interface AwsEnvStackProps extends StackProps {
  config: Readonly<EnvConfigType>;
}
