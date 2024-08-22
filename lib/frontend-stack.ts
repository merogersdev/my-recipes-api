import * as cdk from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { Construct } from "constructs";

import type { AwsEnvStackProps } from "../types";

export class MyRecipesFrontendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AwsEnvStackProps) {
    super(scope, id, props);

    const { config } = props;

    // --- FRONTEND --- ///

    // S3 Bucket
    new Bucket(this, "MyRecipesFrontend", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: config.BUCKET_NAME,
      versioned: true,
    });
  }
}
