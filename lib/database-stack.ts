import { Stack, CfnOutput, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";

import { Table, AttributeType, BillingMode } from "aws-cdk-lib/aws-dynamodb";

import type { AwsEnvStackProps } from "./shared/types";

export class MyRecipesDatabaseStack extends Stack {
  constructor(scope: Construct, id: string, props: AwsEnvStackProps) {
    super(scope, id, props);

    const { config } = props;

    // --- Database --- //

    // DynamoDB Table
    const recipeTable = new Table(this, "recipeTable", {
      partitionKey: {
        name: "recipeId",
        type: AttributeType.STRING,
      },
      sortKey: {
        name: "ModifiedAt",
        type: AttributeType.STRING,
      },

      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    // Output Recipe Table ARN to use in Backend Stack
    new CfnOutput(this, "RecipeTableArn", {
      value: recipeTable.tableArn,
      exportName: "RecipeTableArn",
    });
  }
}
