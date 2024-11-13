import type { StackProps } from "aws-cdk-lib";
import type { APIGatewayProxyHandlerV2 } from "aws-lambda";

export type EnvConfigType = {
  AWS_ACCOUNT: string;
  AWS_REGION: string;
  AWS_S3_BUCKET: string;
  AWS_DYNAMODB_TABLE: string;
};

export interface AwsEnvStackProps extends StackProps {
  config: Readonly<EnvConfigType>;
}

export interface APIGWProxyPropsWithID extends APIGatewayProxyHandlerV2 {
  event: {
    pathParameters: {
      id: string;
    };
  };
}
