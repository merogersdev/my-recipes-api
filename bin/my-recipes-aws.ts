#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
//import { MyRecipesAwsStack } from "../lib/my-recipes-aws-stack";
import { getConfig } from "../config";

import { MyRecipesBackendStack } from "../lib/backend-stack";
import { MyRecipesFrontendStack } from "../lib/frontend-stack";
import { MyRecipesDatabaseStack } from "../lib/database-stack";

const config = getConfig();

const app = new cdk.App();
//new MyRecipesAwsStack(app, "MyRecipesAwsStack", {});

// --- DynamoDB Database Stack --- //
new MyRecipesDatabaseStack(app, "MyRecipesAwsDatabaseStack", {
  env: {
    region: config.REGION,
    account: config.ACCOUNT,
  },
  config,
});

// --- Rest API, Authorizer, Usage Plan and Lambda Backend Stack --- //
new MyRecipesBackendStack(app, "MyRecipesAwsBackendStack", {
  env: {
    region: config.REGION,
    account: config.ACCOUNT,
  },
  config,
});

// --- S3 Bucket Frontend Stack --- //
new MyRecipesFrontendStack(app, "MyRecipesAwsFrontendStack", {
  env: {
    region: config.REGION,
    account: config.ACCOUNT,
  },
  config,
});
