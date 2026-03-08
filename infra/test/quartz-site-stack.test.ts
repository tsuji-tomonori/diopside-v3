import * as path from "path";
import { App, Aspects } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { AwsSolutionsChecks } from "cdk-nag";
import { QuartzSiteStack } from "../lib/quartz-site-stack";

const fixtureSitePath = path.join(__dirname, "fixtures/site");
const fixtureWebPath = path.join(__dirname, "fixtures/web");

type BuildTemplateOptions = {
  stage?: "dev" | "prod";
  region?: string;
  githubOidcProviderArn?: string;
};

function buildTemplate({
  stage = "dev",
  region,
  githubOidcProviderArn,
}: BuildTemplateOptions = {}): Template {
  const app = new App({
    context: {
      siteAssetPath: fixtureSitePath,
      webAssetPath: fixtureWebPath,
      deploymentStage: stage,
      ...(githubOidcProviderArn ? { githubOidcProviderArn } : {}),
    },
  });

  Aspects.of(app).add(new AwsSolutionsChecks({ verbose: true }));
  const stack = new QuartzSiteStack(app, "QuartzSiteStackTest", {
    ...(region
      ? {
          env: {
            account: "123456789012",
            region,
          },
        }
      : {}),
  });
  return Template.fromStack(stack);
}

describe("QuartzSiteStack", () => {
  test("creates core infrastructure resources", () => {
    const template = buildTemplate();

    template.resourceCountIs("AWS::CloudFront::Distribution", 1);
    template.resourceCountIs("AWS::S3::Bucket", 1);
    template.resourceCountIs("AWS::ApiGatewayV2::Api", 1);
    template.resourceCountIs("AWS::Cognito::UserPool", 1);
    template.resourceCountIs("AWS::Config::ConfigRule", 0);
    template.resourceCountIs("AWS::EC2::VPC", 1);
    template.resourceCountIs("AWS::CloudWatch::Alarm", 3);
  });

  test("uses documented dev network CIDR plan", () => {
    const template = buildTemplate({ stage: "dev" });

    template.hasResourceProperties("AWS::EC2::VPC", {
      CidrBlock: "10.20.0.0/16",
    });
    template.hasResourceProperties("AWS::EC2::Subnet", {
      CidrBlock: "10.20.0.0/24",
    });
    template.hasResourceProperties("AWS::EC2::Subnet", {
      CidrBlock: "10.20.10.0/24",
    });
    template.hasResourceProperties("AWS::EC2::Subnet", {
      CidrBlock: "10.20.20.0/24",
    });
  });

  test("uses documented prod network CIDR plan", () => {
    const template = buildTemplate({ stage: "prod" });

    template.hasResourceProperties("AWS::EC2::VPC", {
      CidrBlock: "10.22.0.0/16",
    });
    template.hasResourceProperties("AWS::EC2::Subnet", {
      CidrBlock: "10.22.0.0/24",
    });
    template.hasResourceProperties("AWS::EC2::Subnet", {
      CidrBlock: "10.22.10.0/24",
    });
    template.hasResourceProperties("AWS::EC2::Subnet", {
      CidrBlock: "10.22.20.0/24",
    });
  });

  test("defines CloudFront behavior boundaries", () => {
    const template = buildTemplate();

    template.hasResourceProperties("AWS::CloudFront::Distribution", {
      DistributionConfig: {
        DefaultCacheBehavior: Match.objectLike({
          ViewerProtocolPolicy: "redirect-to-https",
        }),
        CacheBehaviors: Match.arrayWith([
          Match.objectLike({ PathPattern: "/api/*" }),
          Match.objectLike({ PathPattern: "/openapi/*" }),
          Match.objectLike({ PathPattern: "/docs/*" }),
          Match.objectLike({ PathPattern: "/web/*" }),
        ]),
      },
    });
  });

  test("associates a viewer-request function with /web/* for SPA fallback", () => {
    const template = buildTemplate();

    template.hasResourceProperties("AWS::CloudFront::Distribution", {
      DistributionConfig: {
        CacheBehaviors: Match.arrayWith([
          Match.objectLike({
            PathPattern: "/web/*",
            FunctionAssociations: Match.arrayWith([
              Match.objectLike({
                EventType: "viewer-request",
              }),
            ]),
          }),
        ]),
      },
    });
  });

  test("enables required-tags config rule inputs in prod", () => {
    const template = buildTemplate({ stage: "prod" });

    template.hasResourceProperties("AWS::Config::ConfigRule", {
      Source: {
        Owner: "AWS",
        SourceIdentifier: "REQUIRED_TAGS",
      },
      InputParameters: Match.objectLike({
        tag1Key: "Project",
        tag2Key: "Environment",
        tag3Key: "Owner",
        tag4Key: "CostCenter",
        tag5Key: "ManagedBy",
        tag6Key: "Description",
      }),
    });
  });

  test("enables API access logs in prod only", () => {
    const prodTemplate = buildTemplate({ stage: "prod" });
    const devTemplate = buildTemplate({ stage: "dev" });

    prodTemplate.hasResourceProperties("AWS::ApiGatewayV2::Stage", {
      AccessLogSettings: Match.objectLike({
        Format: Match.stringLikeRegexp("requestId"),
      }),
      DefaultRouteSettings: {
        ThrottlingBurstLimit: 50,
        ThrottlingRateLimit: 25,
      },
    });

    devTemplate.hasResourceProperties("AWS::ApiGatewayV2::Stage", {
      DefaultRouteSettings: {
        ThrottlingBurstLimit: 50,
        ThrottlingRateLimit: 25,
      },
    });
  });

  test("creates additional prod logging buckets", () => {
    const template = buildTemplate({ stage: "prod" });

    template.resourceCountIs("AWS::S3::Bucket", 3);
  });

  test("does not create logs interface endpoint", () => {
    const template = buildTemplate();

    template.resourceCountIs("AWS::EC2::VPCEndpoint", 1);
    template.hasResourceProperties("AWS::EC2::VPCEndpoint", {
      VpcEndpointType: "Gateway",
    });
  });

  test("creates expected public outputs", () => {
    const template = buildTemplate();
    const outputs = template.toJSON().Outputs as Record<string, unknown>;

    expect(outputs.CloudFrontDomainName).toBeDefined();
    expect(outputs.HttpApiEndpoint).toBeDefined();
    expect(outputs.OpsUserPoolId).toBeDefined();
    expect(outputs.VpcId).toBeDefined();
  });

  test("creates estimated charges alarms in us-east-1", () => {
    const template = buildTemplate({ region: "us-east-1" });
    const outputs = template.toJSON().Outputs as Record<string, unknown>;

    template.resourceCountIs("AWS::CloudWatch::Alarm", 3);
    expect(outputs.MonthlyCostWarnAlarmName).toBeDefined();
    expect(outputs.MonthlyCostCriticalAlarmName).toBeDefined();
  });

  test("skips estimated charges alarms outside us-east-1", () => {
    const template = buildTemplate({ region: "ap-northeast-1" });
    const outputs = template.toJSON().Outputs as Record<string, unknown>;

    template.resourceCountIs("AWS::CloudWatch::Alarm", 1);
    expect(outputs.MonthlyCostWarnAlarmName).toBeUndefined();
    expect(outputs.MonthlyCostCriticalAlarmName).toBeUndefined();
  });

  test("reuses an existing GitHub OIDC provider when ARN is provided", () => {
    const providerArn =
      "arn:aws:iam::123456789012:oidc-provider/token.actions.githubusercontent.com";
    const template = buildTemplate({ githubOidcProviderArn: providerArn });
    const outputs = template.toJSON().Outputs as Record<string, { Value?: unknown }>;

    template.resourceCountIs("Custom::AWSCDKOpenIdConnectProvider", 0);
    template.hasResourceProperties("AWS::IAM::Role", {
      AssumeRolePolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Principal: {
              Federated: providerArn,
            },
          }),
        ]),
      },
    });
    expect(outputs.GithubOidcProviderArn?.Value).toBe(providerArn);
  });

  test("grants GitHub Actions deploy role read access to the OIDC provider", () => {
    const template = buildTemplate();

    template.hasResourceProperties("AWS::IAM::Role", {
      RoleName: "diopside-delivery-dev-github-actions",
      Policies: Match.arrayWith([
        Match.objectLike({
          PolicyDocument: {
            Statement: Match.arrayWith([
              Match.objectLike({
                Action: Match.arrayWith(["iam:GetOpenIDConnectProvider"]),
              }),
            ]),
          },
        }),
      ]),
    });
  });

  test("uses deterministic GitHub Actions deploy role name in prod", () => {
    const template = buildTemplate({ stage: "prod" });
    const outputs = template.toJSON().Outputs as Record<string, unknown>;

    template.hasResourceProperties("AWS::IAM::Role", {
      RoleName: "diopside-delivery-prod-github-actions",
    });
    expect(outputs.GithubActionsDeployRoleName).toBeDefined();
  });

  test("grants GitHub Actions deploy role bootstrap SSM read access", () => {
    const template = buildTemplate();

    template.hasResourceProperties("AWS::IAM::Role", {
      Policies: Match.arrayWith([
        Match.objectLike({
          PolicyDocument: {
            Statement: Match.arrayWith([
              Match.objectLike({
                Action: Match.arrayWith(["ssm:GetParameter"]),
              }),
            ]),
          },
        }),
      ]),
    });
  });

  test("allows bootstrap checks and curated IAM actions through the permission boundary", () => {
    const template = buildTemplate();

    template.hasResourceProperties("AWS::IAM::ManagedPolicy", {
      Description: "Permission boundary for infrastructure roles",
      PolicyDocument: {
        Statement: Match.arrayWith([
          Match.objectLike({
            Effect: "Allow",
            NotAction: Match.arrayWith(["iam:*", "kms:ScheduleKeyDeletion", "s3:DeleteBucket"]),
            Resource: "*",
          }),
          Match.objectLike({
            Effect: "Allow",
            Action: Match.arrayWith([
              "iam:GetOpenIDConnectProvider",
              "iam:GetRole",
              "iam:PassRole",
            ]),
            Resource: "*",
          }),
        ]),
      },
    });
  });
});
