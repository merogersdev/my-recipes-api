import * as cdk from "aws-cdk-lib";
import { Bucket } from "aws-cdk-lib/aws-s3";
import { AttributeType, BillingMode, Table } from "aws-cdk-lib/aws-dynamodb";
import { Construct } from "constructs";
import {
  ApiKey,
  ApiKeySourceType,
  Cors,
  RestApi,
  UsagePlan,
} from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class MyRecipesAwsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // --- DB --- //

    const recipeTable = new Table(this, "recipeTable", {
      partitionKey: {
        name: "pk",
        type: AttributeType.STRING,
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    // --- FRONTEND --- ///

    // S3 Bucket
    const frontendBucket = new Bucket(this, "MyRecipesAWSFrontend", {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: "recipes.merogers.dev",
      versioned: true,
    });

    // --- BACKEND --- //

    // REST API
    const api = new RestApi(this, "MyRecipesAWSAPI", {
      restApiName: "MyRecipesAWSAPI",
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
      apiKeySourceType: ApiKeySourceType.HEADER,
    });

    // API Key
    const backendAPIKey = new ApiKey(this, "MyRecipesAWSAPIKey");

    // Usage Plan
    const backendAPIUsagePlan = new UsagePlan(
      this,
      "MyRecipesAWSBackendUsagePlan",
      {
        name: "My Recipes API Usage Plan",
        apiStages: [
          {
            api,
            stage: api.deploymentStage,
          },
        ],
      }
    );

    // Attach Usage Plan to API
    backendAPIUsagePlan.addApiKey(backendAPIKey);

    // --- LAMBDAS --- //
    const recipeLambda = new NodejsFunction(this, "RecipeLambda", {
      entry: "backend/endpoints/recipe.ts",
      handler: "handler",
      environment: {
        TABLE_NAME: recipeTable.tableName,
      },
    });

    const recipesLambda = new NodejsFunction(this, "RecipesLambda", {
      entry: "backend/endpoints/recipes.ts",
      handler: "handler",
      environment: {
        TABLE_NAME: recipeTable.tableName,
      },
    });

    // DB Permissions
    recipeTable.grantReadWriteData(recipesLambda);
    recipeTable.grantReadWriteData(recipeLambda);
  }
}
