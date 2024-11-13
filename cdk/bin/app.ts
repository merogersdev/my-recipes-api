#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

import { AppStack } from "../lib/appStack";
import { getEnvConfig } from "../../config/env";

const config = getEnvConfig();
const app = new cdk.App();

// Application Stack
new AppStack(app, "MyRecipesAppStack", {
  env: {
    account: config.AWS_ACCOUNT,
    region: config.AWS_REGION,
  },
  config,
});

app.synth();
