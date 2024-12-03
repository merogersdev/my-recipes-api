import { Stack, StackProps, RemovalPolicy } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  ApiKeySourceType,
  RestApi,
  LambdaIntegration,
} from "aws-cdk-lib/aws-apigateway";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Runtime } from "aws-cdk-lib/aws-lambda";
import { AttributeType, Billing, TableV2 } from "aws-cdk-lib/aws-dynamodb";

import type { envType } from "../../schemas/env";

interface AppStackProps extends StackProps {
  config: Readonly<envType>;
}

export class AppStack extends Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    // Env Config Props
    const { config } = props;

    // -------------------------------------- //
    // --- --- --- DynamoDB Table --- --- --- //
    // -------------------------------------- //

    // Single Table for App
    const appTable = new TableV2(this, "MyRecipesTable", {
      tableName: config.AWS_DYNAMODB_TABLE,
      partitionKey: { name: "PK", type: AttributeType.STRING },
      sortKey: { name: "SK", type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      billing: Billing.onDemand(),
      globalSecondaryIndexes: [
        {
          indexName: "GSI1",
          partitionKey: { name: "GSI1PK", type: AttributeType.STRING },
          sortKey: { name: "GSI1SK", type: AttributeType.STRING },
        },
      ],
    });

    // ----------------------------------------------- //
    // --- --- --- Rest API Handler Config --- --- --- //
    // ----------------------------------------------- //

    // Node.js Handler Functions Config
    const nodeFunctionConfig = {
      handler: "handler",
      runtime: Runtime.NODEJS_20_X,
      environment: {
        AWS_DYNAMODB_TABLE: appTable.tableName,
        REGION: this.region,
      },
      memorySize: 1024,
    };

    const nodeFunctionApiConfig = {
      apiKeyRequired: true,
      requestParameters: {
        "method.request.header.x-api-key": true,
      },
    };

    // -------------------------------------------------- //
    // --- --- --- Rest API Handler Functions --- --- --- //
    // -------------------------------------------------- //

    // Create Recipe Handler
    const createRecipe = new NodejsFunction(this, "MyRecipeAppCreateRecipe", {
      functionName: "MyRecipeAppCreateRecipe",
      entry: "services/api/handlers/recipes/createRecipe.ts",
      description: "Create Recipe Lambda Handler",
      ...nodeFunctionConfig,
    });

    // Delete Recipe Handler
    const deleteRecipe = new NodejsFunction(this, "MyRecipeAppDeleteRecipe", {
      functionName: "MyRecipeAppDeleteRecipe",
      entry: "services/api/handlers/recipes/deleteRecipe.ts",
      description: "Delete Recipe Lambda Handler",
      ...nodeFunctionConfig,
    });

    // Get Recipe Handler
    const getRecipe = new NodejsFunction(this, "MyRecipeAppGetRecipe", {
      functionName: "MyRecipeAppGetRecipe",
      entry: "services/api/handlers/recipes/getRecipe.ts",
      description: "Get Recipe Lambda Handler",
      ...nodeFunctionConfig,
    });

    // Update Recipe Handler
    const updateRecipe = new NodejsFunction(this, "MyRecipeAppUpdateRecipe", {
      functionName: "MyRecipeAppUpdateRecipe",
      entry: "services/api/handlers/recipes/updateRecipe.ts",
      description: "Update Recipe Lambda Handler",
      ...nodeFunctionConfig,
    });

    // Update Recipe Handler
    const getAllRecipes = new NodejsFunction(this, "MyRecipeAppGetAllRecipes", {
      functionName: "MyRecipeAppGetAllRecipes",
      entry: "services/api/handlers/recipes/getAllRecipes.ts",
      description: "Get All Recipes Lambda Handler",
      ...nodeFunctionConfig,
    });

    // Get User Handler
    const getUser = new NodejsFunction(this, "MyRecipeAppGetUser", {
      functionName: "MyRecipeAppGetUser",
      entry: "services/api/handlers/users/getUser.ts",
      description: "Get User Lambda Handler",
      ...nodeFunctionConfig,
    });

    // Create User Handler
    const createUser = new NodejsFunction(this, "MyRecipeAppCreateUser", {
      functionName: "MyRecipeAppCreateUser",
      entry: "services/api/handlers/users/createUser.ts",
      description: "Create New User Lambda Handler",
      ...nodeFunctionConfig,
    });

    // Create User Handler
    const deleteUser = new NodejsFunction(this, "MyRecipeAppDeleteUser", {
      functionName: "MyRecipeAppDeleteUser",
      entry: "services/api/handlers/users/deleteUser.ts",
      description: "Delete User Lambda Handler",
      ...nodeFunctionConfig,
    });

    // Create User Handler
    const updateUser = new NodejsFunction(this, "MyRecipeAppUpdateUser", {
      functionName: "MyRecipeAppUpdateUser",
      entry: "services/api/handlers/users/updateUser.ts",
      description: "Update User Lambda Handler",
      ...nodeFunctionConfig,
    });

    // Create Like Handler
    const createLike = new NodejsFunction(this, "MyRecipeAppCreateLike", {
      functionName: "MyRecipeAppCreateLike",
      entry: "services/api/handlers/likes/createLike.ts",
      description: "Create Like Lambda Handler",
      ...nodeFunctionConfig,
    });

    // List Likes Handler
    const listLikes = new NodejsFunction(this, "MyRecipeAppListLikes", {
      functionName: "MyRecipeAppListLikes",
      entry: "services/api/handlers/likes/listLikes.ts",
      description: "List Likes Lambda Handler",
      ...nodeFunctionConfig,
    });

    // Create Comment Handler
    const createComment = new NodejsFunction(this, "MyRecipeAppCreateComment", {
      functionName: "MyRecipeAppCreateComment",
      entry: "services/api/handlers/comments/createComment.ts",
      description: "Create Comment Lambda Handler",
      ...nodeFunctionConfig,
    });

    // Delete Comment Handler
    const deleteComment = new NodejsFunction(this, "MyRecipeAppDeleteComment", {
      functionName: "MyRecipeAppDeleteComment",
      entry: "services/api/handlers/comments/deleteComment.ts",
      description: "Delete Comment Lambda Handler",
      ...nodeFunctionConfig,
    });

    // Get All Comments Handler
    const getAllComments = new NodejsFunction(
      this,
      "MyRecipeAppGetAllComments",
      {
        functionName: "MyRecipeAppGetAllComments",
        entry: "services/api/handlers/comments/getAllComments.ts",
        description: "Get All Comments Lambda Handler",
        ...nodeFunctionConfig,
      }
    );

    // Get Comment Handler
    const getComment = new NodejsFunction(this, "MyRecipeAppGetComment", {
      functionName: "MyRecipeAppGetComment",
      entry: "services/api/handlers/comments/getComment.ts",
      description: "Get Comment Lambda Handler",
      ...nodeFunctionConfig,
    });

    // Update Comment Handler
    const updateComment = new NodejsFunction(this, "MyRecipeAppUpdateComment", {
      functionName: "MyRecipeAppUpdateComment",
      entry: "services/api/handlers/comments/updateComment.ts",
      description: "Update Comment Lambda Handler",
      ...nodeFunctionConfig,
    });

    // --------------------------------------- //
    // --- --- --- Rest API Config --- --- --- //
    // --------------------------------------- //

    // Rest API With Lambda Integration
    const api = new RestApi(this, "MyPortfolioAppRestApi", {
      restApiName: "MyRecipesAppApi",
      apiKeySourceType: ApiKeySourceType.HEADER,
      defaultCorsPreflightOptions: {
        allowOrigins: ["*"],
        allowMethods: ["POST", "GET", "PATCH", "DELETE", "OPTIONS"],
        allowHeaders: [
          "Content-Type",
          "Authorization",
          "X-Amz-Date",
          "X-Api-Key",
          "X-Amz-Security-Token",
          "X-Amz-User-Agent",
        ],
        allowCredentials: true,
      },
    });

    // ------------------------------------------------------- //
    // --- --- --- Rest API Handler DB Permissions --- --- --- //
    // ------------------------------------------------------- //

    // Add DynamoDB Read/Write permissions to handlers
    appTable.grantReadWriteData(createRecipe);
    appTable.grantReadWriteData(deleteRecipe);
    appTable.grantReadWriteData(getRecipe);
    appTable.grantReadWriteData(updateRecipe);
    appTable.grantReadWriteData(getAllRecipes);

    appTable.grantReadWriteData(createUser);
    appTable.grantReadWriteData(getUser);
    appTable.grantReadWriteData(updateUser);
    appTable.grantReadWriteData(deleteUser);

    appTable.grantReadWriteData(createLike);
    appTable.grantReadWriteData(listLikes);

    appTable.grantReadWriteData(createComment);
    appTable.grantReadWriteData(deleteComment);
    appTable.grantReadWriteData(getAllComments);
    appTable.grantReadWriteData(getComment);
    appTable.grantReadWriteData(updateComment);

    // ----------------------------------------------------- //
    // --- --- --- Rest API Handler Integrations --- --- --- //
    // ----------------------------------------------------- //

    // Integrate Lambdas with API
    const createRecipeIntegration = new LambdaIntegration(createRecipe);
    const deleteRecipeIntegration = new LambdaIntegration(deleteRecipe);
    const getRecipeIntegration = new LambdaIntegration(getRecipe);
    const updateRecipeIntegration = new LambdaIntegration(updateRecipe);
    const getAllRecipesIntegration = new LambdaIntegration(getAllRecipes);

    const createUserIntegration = new LambdaIntegration(createUser);
    const getUserIntegration = new LambdaIntegration(getUser);
    const updateUserIntegration = new LambdaIntegration(updateUser);
    const deleteUserIntegration = new LambdaIntegration(deleteUser);

    const createLikeIntegration = new LambdaIntegration(createLike);
    const listLikesIntegration = new LambdaIntegration(listLikes);

    const createCommentIntegration = new LambdaIntegration(createComment);
    const deleteCommentIntegration = new LambdaIntegration(deleteComment);
    const getAllCommentsIntegration = new LambdaIntegration(getAllComments);
    const getCommentIntegration = new LambdaIntegration(getComment);
    const updateCommentIntegration = new LambdaIntegration(updateComment);

    // ---------------------------------------------------- //
    // --- --- --- Rest API Endpoints & Methods --- --- --- //
    // ---------------------------------------------------- //

    // Add resources and methods
    const apiVersion = "v1";
    const apiBase = api.root.addResource(apiVersion);

    // /recipes
    const recipesBase = apiBase.addResource("recipes");
    const recipesWithUsername = recipesBase.addResource("{username}");
    const recipeWithID = recipesWithUsername.addResource("{recipeId}");

    // /recipes/{username}
    recipesWithUsername.addMethod("POST", createRecipeIntegration, {
      ...nodeFunctionApiConfig,
    });
    recipesWithUsername.addMethod("GET", getAllRecipesIntegration, {
      ...nodeFunctionApiConfig,
    });

    // /recipes/{username}/{id}
    recipeWithID.addMethod("GET", getRecipeIntegration, {
      ...nodeFunctionApiConfig,
    });
    recipeWithID.addMethod("PATCH", updateRecipeIntegration, {
      ...nodeFunctionApiConfig,
    });
    recipeWithID.addMethod("DELETE", deleteRecipeIntegration, {
      ...nodeFunctionApiConfig,
    });

    // /recipes/{username}/{id}/likes
    const recipeWithIDLikes = recipeWithID.addResource("likes");
    recipeWithIDLikes.addMethod("POST", createLikeIntegration, {
      ...nodeFunctionApiConfig,
    });
    recipeWithIDLikes.addMethod("GET", listLikesIntegration, {
      ...nodeFunctionApiConfig,
    });

    // /recipes/{username}/{id}/comments
    const recipeWithComments = recipeWithID.addResource("comments");
    recipeWithComments.addMethod("GET", getAllCommentsIntegration, {
      ...nodeFunctionApiConfig,
    });
    recipeWithComments.addMethod("POST", createCommentIntegration, {
      ...nodeFunctionApiConfig,
    });

    // /recipes/{username}/{id}/comments/{commentId}
    const recipeWithCommentsId = recipeWithComments.addResource("{commentId}");
    recipeWithCommentsId.addMethod("GET", getCommentIntegration, {
      ...nodeFunctionApiConfig,
    });
    recipeWithCommentsId.addMethod("PATCH", updateCommentIntegration, {
      ...nodeFunctionApiConfig,
    });
    recipeWithCommentsId.addMethod("DELETE", deleteCommentIntegration, {
      ...nodeFunctionApiConfig,
    });

    // /users
    const usersBase = apiBase.addResource("users");
    usersBase.addMethod("POST", createUserIntegration, {
      ...nodeFunctionApiConfig,
    });

    // /users/{username}
    const usersWithUsername = usersBase.addResource("{username}");
    usersWithUsername.addMethod("GET", getUserIntegration, {
      ...nodeFunctionApiConfig,
    });
    usersWithUsername.addMethod("PATCH", updateUserIntegration, {
      ...nodeFunctionApiConfig,
    });
    usersWithUsername.addMethod("DELETE", deleteUserIntegration, {
      ...nodeFunctionApiConfig,
    });

    // ------------------------------------------- //
    // --- --- --- Rest API Usage Plan --- --- --- //
    // ------------------------------------------- //

    const plan = api.addUsagePlan("MyRecipeAppUsagePlan", {
      name: "MyRecipeAppUsagePlan",
      throttle: {
        rateLimit: 10,
        burstLimit: 20,
      },
    });

    const key = api.addApiKey("MyRecipeAppApiKey");
    plan.addApiKey(key);
  }
}
