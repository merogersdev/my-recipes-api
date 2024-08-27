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

import type { AwsEnvStackProps } from "../shared/types";

import { Table, type ITable } from "aws-cdk-lib/aws-dynamodb";

export class MyRecipesBackendStack extends Stack {
  constructor(scope: Construct, id: string, props: AwsEnvStackProps) {
    super(scope, id, props);

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
    const getAllRecipesLambda = new NodejsFunction(
      this,
      "GetAllRecipesLambda",
      {
        functionName: "getAllRecipes",
        entry: "lib/backend/lambda/recipes/get-all.ts",
        runtime: Runtime.NODEJS_20_X,
        handler: "handler",
        environment: {
          AWS_TABLE_NAME: recipeTable.tableName,
        },
      }
    );

    // Get One Recipe
    const getRecipeLambda = new NodejsFunction(this, "GetRecipeLambda", {
      functionName: "getRecipe",
      entry: "lib/backend/lambda/recipes/get-one.ts",
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      environment: {
        AWS_TABLE_NAME: recipeTable.tableName,
      },
    });

    // Create New Recipe
    const createRecipeLambda = new NodejsFunction(this, "CreateRecipeLambda", {
      functionName: "createRecipe",
      entry: "lib/backend/lambda/recipes/create.ts",
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      environment: {
        AWS_TABLE_NAME: recipeTable.tableName,
      },
    });

    // Update Recipe
    const updateRecipeLambda = new NodejsFunction(this, "UpdateRecipeLambda", {
      functionName: "updateRecipe",
      entry: "lib/backend/lambda/recipes/update.ts",
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      environment: {
        AWS_TABLE_NAME: recipeTable.tableName,
      },
    });

    // Update Recipe
    const deleteRecipeLambda = new NodejsFunction(this, "DeleteRecipeLambda", {
      functionName: "deleteRecipe",
      entry: "lib/backend/lambda/recipes/delete.ts",
      runtime: Runtime.NODEJS_20_X,
      handler: "handler",
      environment: {
        AWS_TABLE_NAME: recipeTable.tableName,
      },
    });

    // DB Permissions
    recipeTable.grantReadWriteData(getAllRecipesLambda);
    recipeTable.grantReadWriteData(getRecipeLambda);
    recipeTable.grantReadWriteData(createRecipeLambda);
    recipeTable.grantReadWriteData(updateRecipeLambda);
    recipeTable.grantReadWriteData(deleteRecipeLambda);

    // API Gateway Methods
    const version = api.root.addResource("v1");
    const recipes = version.addResource("recipes");
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
