import { Stack, CfnOutput, Duration, Fn } from "aws-cdk-lib";
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

import {
  OAuthScope,
  UserPool,
  UserPoolClientIdentityProvider,
  UserPoolDomain,
} from "aws-cdk-lib/aws-cognito";

import type { AwsEnvStackProps } from "./shared/types";

import { Table, type ITable } from "aws-cdk-lib/aws-dynamodb";

export class MyRecipesBackendStack extends Stack {
  constructor(scope: Construct, id: string, props: AwsEnvStackProps) {
    super(scope, id, props);

    const { config } = props;

    const recipeTableArn = Fn.importValue("RecipeTableArn");
    const recipeTable: ITable = Table.fromTableArn(
      this,
      "RecipeTable",
      recipeTableArn
    );

    // --- Auth --- ///
    const myRecipesUserPool = new UserPool(this, "MyRecipesUserPool", {
      userPoolName: "MyRecipesUserPool",
      signInAliases: {
        email: true,
      },
      selfSignUpEnabled: true,
    });

    myRecipesUserPool.addClient("MyRecipesUserPool", {
      userPoolClientName: "MyRecipesApp",
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

    // --- BACKEND --- //

    // Rest API Gateway
    const api = new RestApi(this, "MyRecipesRestApi", {
      restApiName: "MyRecipesRestApi",
      defaultCorsPreflightOptions: {
        allowOrigins: Cors.ALL_ORIGINS,
        allowMethods: Cors.ALL_METHODS,
      },
      apiKeySourceType: ApiKeySourceType.HEADER,
    });

    const authorizer = new CfnAuthorizer(this, "myRecipesAuthorizer", {
      restApiId: api.restApiId,
      name: "MyRecipesRestApiAuthorizer",
      type: "COGNITO_USER_POOLS",
      identitySource: "method.request.header.Authorization",
      providerArns: [myRecipesUserPool.userPoolArn],
    });

    // Authorizer Options
    const authorizerOptions = {
      authorizationType: AuthorizationType.COGNITO,
      authorizer: {
        authorizerId: authorizer.ref,
      },
    };

    // API Key
    const backendAPIKey = new ApiKey(this, "MyRecipesApiKey");

    // Usage Plan
    const backendAPIUsagePlan = new UsagePlan(this, "MyRecipesApiUsagePlan", {
      name: "My Recipes API Usage Plan",
      apiStages: [
        {
          api,
          stage: api.deploymentStage,
        },
      ],
    });

    // Attach Usage Plan to API
    backendAPIUsagePlan.addApiKey(backendAPIKey);

    // Get All Recipes
    const getAllRecipesLambda = new NodejsFunction(this, "GetRecipesLambda", {
      functionName: "getAllRecipes",
      entry: "backend/lambda/get-all-recipes.ts",
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      environment: {
        DYNAMODB_TABLE_NAME: config.DYNAMODB_TABLE_NAME,
      },
    });

    // Get One Recipe
    const getRecipeLambda = new NodejsFunction(this, "GetRecipesLambda", {
      functionName: "getRecipe",
      entry: "backend/lambda/get-recipe.ts",
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      environment: {
        DYNAMODB_TABLE_NAME: config.DYNAMODB_TABLE_NAME,
      },
    });

    // Create New Recipe
    const createRecipeLambda = new NodejsFunction(this, "CreateRecipeLambda", {
      functionName: "createRecipe",
      entry: "backend/lambda/create-recipe.ts",
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      environment: {
        DYNAMODB_TABLE_NAME: config.DYNAMODB_TABLE_NAME,
      },
    });

    // Update Recipe
    const updateRecipeLambda = new NodejsFunction(this, "CreateRecipeLambda", {
      functionName: "updateRecipe",
      entry: "backend/lambda/update-recipe.ts",
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      environment: {
        DYNAMODB_TABLE_NAME: config.DYNAMODB_TABLE_NAME,
      },
    });

    // Update Recipe
    const deleteRecipeLambda = new NodejsFunction(this, "CreateRecipeLambda", {
      functionName: "deleteRecipe",
      entry: "backend/lambda/delete-recipe.ts",
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      environment: {
        DYNAMODB_TABLE_NAME: config.DYNAMODB_TABLE_NAME,
      },
    });

    // DB Permissions
    recipeTable.grantReadWriteData(getAllRecipesLambda);
    recipeTable.grantReadWriteData(getRecipeLambda);
    recipeTable.grantReadWriteData(createRecipeLambda);
    recipeTable.grantReadWriteData(updateRecipeLambda);
    recipeTable.grantReadWriteData(deleteRecipeLambda);

    // API Gateway Methods
    const recipes = api.root.addResource("recipes");
    const recipe = recipes.addResource("{id}");

    // GET: /recipes
    recipes.addMethod("GET", new LambdaIntegration(getAllRecipesLambda), {
      ...authorizerOptions,
      apiKeyRequired: true,
    });

    // POST: /Recipes
    recipes.addMethod("POST", new LambdaIntegration(createRecipeLambda), {
      ...authorizerOptions,
      apiKeyRequired: true,
    });

    // GET: /recipes/id
    recipe.addMethod("GET", new LambdaIntegration(getRecipeLambda), {
      ...authorizerOptions,
      apiKeyRequired: true,
    });

    // PUT: /recipes/id
    recipe.addMethod("PUT", new LambdaIntegration(updateRecipeLambda), {
      ...authorizerOptions,
      apiKeyRequired: true,
    });

    // DELETE: /recipes/id
    recipe.addMethod("DELETE", new LambdaIntegration(deleteRecipeLambda), {
      ...authorizerOptions,
      apiKeyRequired: true,
    });

    // Output API Key ID
    new CfnOutput(this, "API Key ID", {
      value: backendAPIKey.keyId,
    });
  }
}
