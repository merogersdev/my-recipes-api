import {
  Stack,
  StackProps,
  CfnOutput,
  RemovalPolicy,
  Duration,
} from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  ApiKey,
  ApiKeySourceType,
  AuthorizationType,
  CfnAuthorizer,
  Cors,
  LambdaIntegration,
  RestApi,
  UsagePlan,
} from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { Table, AttributeType, BillingMode } from "aws-cdk-lib/aws-dynamodb";

import {
  OAuthScope,
  UserPool,
  UserPoolClientIdentityProvider,
  UserPoolDomain,
} from "aws-cdk-lib/aws-cognito";

import type { AwsEnvStackProps } from "../types";

export class MyRecipesAwsBackendStack extends Stack {
  constructor(scope: Construct, id: string, props: AwsEnvStackProps) {
    super(scope, id, props);

    const { config } = props;

    // --- Auth --- ///
    const myRecipesUserPool = new UserPool(this, "MyRecipesUserPool", {
      userPoolName: "MyRecipesUserPool",
      signInAliases: {
        email: true,
      },
      selfSignUpEnabled: true,
    });

    myRecipesUserPool.addClient("MyRecipesUserPool", {
      userPoolClientName: "MyRecipesAwsApp",
      oAuth: {
        flows: { implicitCodeGrant: true },
        scopes: [OAuthScope.OPENID],
        callbackUrls: ["http://localhost:3000"],
      },
      supportedIdentityProviders: [UserPoolClientIdentityProvider.COGNITO],
      refreshTokenValidity: Duration.days(1),
      idTokenValidity: Duration.days(1),
      accessTokenValidity: Duration.days(1),
    });

    new UserPoolDomain(this, "MyRecipesUserPoolDomain", {
      userPool: myRecipesUserPool,
      cognitoDomain: {
        domainPrefix: "my-recipes",
      },
    });

    // --- Database --- //

    // DynamoDB Table
    const recipeTable = new Table(this, "recipeTable", {
      partitionKey: {
        name: "id",
        type: AttributeType.STRING,
      },
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST,
    });

    // --- BACKEND --- //

    // Rest API Gateway
    const api = new RestApi(this, "MyRecipesAWSAPI", {
      restApiName: "MyRecipesAWSAPI",
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
      apiKeySourceType: ApiKeySourceType.HEADER,
    });

    const authorizer = new CfnAuthorizer(this, "myRecipesAuthorizer", {
      restApiId: api.restApiId,
      name: "MyRecipesAPIAuthorizer",
      type: "COGNITO_USER_POOLS",
      identitySource: "method.request.header.Authorization",
      providerArns: [myRecipesUserPool.userPoolArn],
    });

    const authorizerOptions: any = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.ref,
      },
    };

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

    // Get All Recipes
    const getRecipesLambda = new NodejsFunction(this, "GetRecipesLambda", {
      functionName: "getRecipes",
      entry: "backend/lambdas/getRecipes.ts",
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      environment: {
        TABLE_NAME: config.TABLE_NAME,
      },
    });

    // Post New Recipe
    const createRecipeLambda = new NodejsFunction(this, "CreateRecipeLambda", {
      functionName: "postRecipe",
      entry: "backend/lambdas/createRecipe.ts",
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      environment: {
        TABLE_NAME: config.TABLE_NAME,
      },
    });

    // DB Permissions
    recipeTable.grantReadWriteData(getRecipesLambda);
    recipeTable.grantReadWriteData(createRecipeLambda);

    // API Gateway Methods
    const recipes = api.root.addResource("recipes");

    // GET: /recipes
    recipes.addMethod("GET", new LambdaIntegration(getRecipesLambda), {
      ...authorizerOptions,
      apiKeyRequired: true,
    });

    // POST: /Recipes
    recipes.addMethod("POST", new LambdaIntegration(createRecipeLambda), {
      ...authorizerOptions,
      apiKeyRequired: true,
    });

    // Output API Key ID
    new CfnOutput(this, "API Key ID", {
      value: backendAPIKey.keyId,
    });
  }
}
