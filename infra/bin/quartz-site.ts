#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { Aspects } from "aws-cdk-lib";
import { AwsSolutionsChecks } from "cdk-nag";
import { QuartzSiteStack } from "../lib/quartz-site-stack";

const app = new cdk.App();

const account = process.env.CDK_DEFAULT_ACCOUNT;
const region = process.env.CDK_DEFAULT_REGION;
const env: cdk.Environment = {
  ...(account ? { account } : {}),
  ...(region ? { region } : {}),
};

new QuartzSiteStack(app, "DiopsideDeliveryStack", {
  env,
});

Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
