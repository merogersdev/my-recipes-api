#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";

import { AppStack } from "../lib/appStack";
import { env } from "../../schemas/env";

const app = new cdk.App();

// Application Stack
new AppStack(app, "MyRecipesAppStack", {
  env: {
    account: env.AWS_ACCOUNT,
    region: env.AWS_REGION,
  },
  config: env,
});

app.synth();
