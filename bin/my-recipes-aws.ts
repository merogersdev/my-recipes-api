#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

import { getEnvConfig } from "../lib/config/env";
import { MyRecipesBackendStack } from "../lib/stacks/backend";
import { MyRecipesFrontendStack } from "../lib/stacks/frontend";
import { MyRecipesDatabaseStack } from "../lib/stacks/database";

const config = getEnvConfig();

const app = new cdk.App();

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
