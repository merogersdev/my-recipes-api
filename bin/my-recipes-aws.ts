#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
//import { MyRecipesAwsStack } from "../lib/my-recipes-aws-stack";
import { getConfig } from "../config";

import { MyRecipesAwsBackendStack } from "../lib/backend-stack";
import { MyRecipesAwsFrontendStack } from "../lib/frontend-stack";

const config = getConfig();

const app = new cdk.App();
//new MyRecipesAwsStack(app, "MyRecipesAwsStack", {});

new MyRecipesAwsBackendStack(app, "MyRecipesAwsBackendStack", {
  env: {
    region: config.REGION,
    account: config.ACCOUNT,
  },
  config,
});
new MyRecipesAwsFrontendStack(app, "MyRecipesAwsFrontendStack", {
  env: {
    region: config.REGION,
    account: config.ACCOUNT,
  },
  config,
});
