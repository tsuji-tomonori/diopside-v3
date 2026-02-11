#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { Aspects } from "aws-cdk-lib";
import { AwsSolutionsChecks } from "cdk-nag";
import { QuartzSiteStack } from "../lib/quartz-site-stack";

const app = new cdk.App();

new QuartzSiteStack(app, "QuartzSiteStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
});

Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
