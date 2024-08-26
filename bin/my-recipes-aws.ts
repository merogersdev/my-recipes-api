#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
//import { MyRecipesAwsStack } from "../lib/my-recipes-aws-stack";
import { getEnvConfig } from "../lib/config/env";

import { MyRecipesBackendStack } from "../lib/backend-stack";
import { MyRecipesFrontendStack } from "../lib/frontend-stack";
import { MyRecipesDatabaseStack } from "../lib/database-stack";

const config = getEnvConfig();

const app = new cdk.App();
//new MyRecipesAwsStack(app, "MyRecipesAwsStack", {});

// --- DynamoDB Database Stack --- //
new MyRecipesDatabaseStack(app, "MyRecipesDatabaseStack", {
  env: {
    region: config.AWS_REGION,
    account: config.AWS_ACCOUNT,
  },
  config,
});

// --- Rest API, Authorizer, Usage Plan and Lambda Backend Stack --- //
new MyRecipesBackendStack(app, "MyRecipesBackendStack", {
  env: {
    region: config.AWS_REGION,
    account: config.AWS_ACCOUNT,
  },
  config,
});

// --- S3 Bucket Frontend Stack --- //
new MyRecipesFrontendStack(app, "MyRecipesFrontendStack", {
  env: {
    region: config.AWS_REGION,
    account: config.AWS_ACCOUNT,
  },
  config,
});
